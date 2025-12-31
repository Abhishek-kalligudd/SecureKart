import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export type GeminiRiskResult = {
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  reason: string;
};

export async function evaluateFraudWithGemini(input: {
  total_amount: number;
  item_count: number;
  payment_method: string;
  is_new_user: boolean;
  has_digital_product: boolean;
  country: string;
}): Promise<GeminiRiskResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a fraud detection system for an e-commerce checkout.

Analyze the following checkout data and assess fraud risk.

Respond ONLY in valid JSON with this exact schema:
{
  "risk_level": "LOW | MEDIUM | HIGH",
  "reason": "short explanation"
}

Checkout data:
- Total amount: ${input.total_amount}
- Item count: ${input.item_count}
- Payment method: ${input.payment_method}
- Is new user: ${input.is_new_user}
- Contains digital products: ${input.has_digital_product}
- Country: ${input.country}

Rules:
- COD orders are riskier than prepaid
- Digital goods increase fraud risk
- New users increase fraud risk
- High item count increases fraud risk
- High total amount increases fraud risk
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  console.log("Gemini AI raw response:", text);

  // Try to extract JSON from response
  const match = text.match(/{.*}/s); // 's' flag allows newlines
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch (err) {
      console.error("Failed to parse extracted JSON:", err);
    }
  }

  // Fallback if parsing fails
  return {
    risk_level: "MEDIUM",
    reason: "AI response could not be parsed safely",
  };
}

