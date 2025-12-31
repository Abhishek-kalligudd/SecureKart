import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { evaluateFraudWithGemini } from "@/lib/geminiFraudEvaluator"

export async function POST(req: Request) {
  const body = await req.json()

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
  } = body

  // ----------------------------
  // RULE-BASED BASELINE
  // ----------------------------
  let ruleScore = 0

  if (payment_method === "COD") ruleScore += 2
  if (has_digital_product) ruleScore += 2
  if (is_new_user) ruleScore += 1
  if (item_count >= 10) ruleScore += 1
  if (total_amount >= 3000) ruleScore += 1

  let ruleRisk: "LOW" | "MEDIUM" | "HIGH" = "LOW"
  if (ruleScore >= 4) ruleRisk = "HIGH"
  else if (ruleScore >= 2) ruleRisk = "MEDIUM"

  // ----------------------------
  // GEMINI AI EVALUATION
  // ----------------------------
  const aiResult = await evaluateFraudWithGemini({
    total_amount,
    item_count,
    payment_method,
    is_new_user,
    has_digital_product,
    country,
  })

  // ----------------------------
  // FINAL DECISION (RULES > AI)
  // ----------------------------
  let finalRisk = ruleRisk
  let decision: "APPROVED" | "VERIFY" | "BLOCKED" = "APPROVED"

  if (ruleRisk === "HIGH") {
    finalRisk = "HIGH"
    decision = "BLOCKED"
  } else if (ruleRisk === "MEDIUM") {
    finalRisk = aiResult.risk_level
    decision =
      finalRisk === "HIGH"
        ? "BLOCKED"
        : "VERIFY"
  } else {
    // LOW rule risk → AI can upgrade to MEDIUM
    if (aiResult.risk_level === "HIGH") {
      finalRisk = "MEDIUM"
      decision = "VERIFY"
    }
  }

  // ----------------------------
  // STORE EVENT
  // ----------------------------
  const { error } = await supabase
    .from("checkout_events")
    .insert({
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
    })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    status: "evaluated",
    ruleRisk,
    aiRisk: aiResult.risk_level,
    finalRisk,
    decision,
    ai_reason: aiResult.reason,
  })
}
