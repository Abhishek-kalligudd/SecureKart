import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { evaluateFraudWithGemini } from "@/lib/geminiFraudEvaluator";
import { checkLocationAnomaly } from "@/lib/locationService";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    user_id,
    total_amount,
    item_count,
    has_digital_product,
    payment_method,
    country,
    ip_address,
    device_fingerprint,
    is_new_user,
  } = body;

  // ----------------------------
  // ⚡ 1. VELOCITY CHECK (Bulk Order Detection)
  // ----------------------------
  // Check orders from this IP or User in the last 1 hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count } = await supabase
    .from("checkout_events")
    .select("*", { count: "exact", head: true })
    .or(`ip_address.eq.${ip_address},user_id.eq.${user_id}`)
    .gt("created_at", oneHourAgo);

  // LIMIT: Block if they already have 3 or more orders in the last hour
  if (count !== null && count >= 3) {
    const reason = "High Velocity: Too many orders placed in a short time (Potential Bulk Order).";
    
    // Log the blocked attempt so we have a record
    await supabase.from("checkout_events").insert({
      user_id,
      is_new_user,
      total_amount,
      item_count,
      has_digital_product,
      payment_method,
      country,
      ip_address,
      device_fingerprint,
      risk_level: "HIGH",
      decision: "BLOCKED",
      ai_reason: reason,
    });

    console.log(`VELOCITY BLOCK: ${count} orders in last hour from ${ip_address}`);

    return NextResponse.json({
      status: "blocked",
      decision: "BLOCKED",
      ai_reason: "You have placed too many orders recently. Please try again in an hour.",
    });
  }

  // ----------------------------
  // 2. RULE-BASED BASELINE
  // ----------------------------
  let ruleScore = 0;

  if (payment_method === "COD") ruleScore += 2;
  if (has_digital_product) ruleScore += 2;
  if (is_new_user) ruleScore += 1;
  if (item_count >= 10) ruleScore += 1;
  if (total_amount >= 3000) ruleScore += 1;

  let ruleRisk: "LOW" | "MEDIUM" | "HIGH" = "LOW";
  if (ruleScore >= 4) ruleRisk = "HIGH";
  else if (ruleScore >= 2) ruleRisk = "MEDIUM";

  // ----------------------------
  // 3. LOCATION ANOMALY CHECK
  // ----------------------------
  const locationCheck = await checkLocationAnomaly(ip_address, country);

  if (locationCheck.isMismatch) {
    // Penalize heavily for location mismatch
    ruleScore += 5;
    console.log(
      `Location Mismatch! IP is in ${locationCheck.detectedCountry} but order is for ${country}`,
    );
  }

  // Recalculate Risk based on new score
  if (ruleScore >= 4) ruleRisk = "HIGH";
  else if (ruleScore >= 2) ruleRisk = "MEDIUM";

  // ----------------------------
  // 4. GEMINI AI EVALUATION
  // ----------------------------
  const aiResult = await evaluateFraudWithGemini({
    total_amount,
    item_count,
    payment_method,
    is_new_user,
    has_digital_product,
    country,
    location_mismatch: locationCheck.isMismatch,
    detected_country: locationCheck.detectedCountry
  });

  // ----------------------------
  // 5. FINAL DECISION (RULES > AI)
  // ----------------------------
  let finalRisk = ruleRisk;
  let decision: "APPROVED" | "VERIFY" | "BLOCKED" = "APPROVED";

  if (ruleRisk === "HIGH") {
    finalRisk = "HIGH";
    decision = "BLOCKED";
  } else if (ruleRisk === "MEDIUM") {
    finalRisk = aiResult.risk_level;
    decision = finalRisk === "HIGH" ? "BLOCKED" : "VERIFY";
  } else {
    // LOW rule risk → AI can upgrade to MEDIUM
    if (aiResult.risk_level === "HIGH") {
      finalRisk = "MEDIUM";
      decision = "VERIFY";
    }
  }

  // ----------------------------
  // 6. STORE EVENT
  // ----------------------------
  const { error } = await supabase.from("checkout_events").insert({
    user_id,
    is_new_user,
    total_amount,
    item_count,
    has_digital_product,
    payment_method,
    country,
    ip_address,
    device_fingerprint,
    risk_level: finalRisk,
    decision,
    ai_reason: aiResult.reason,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    status: "evaluated",
    ruleRisk,
    aiRisk: aiResult.risk_level,
    finalRisk,
    decision,
    ai_reason: aiResult.reason,
  });
}