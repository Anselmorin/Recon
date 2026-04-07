import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { task, gain, estimatedMinutes, context = [] } = await req.json();

  const contextBlock = context.length > 0
    ? `\nAdditional context from user:\n${context.join("\n")}`
    : "";

  const prompt = `You are a brutally honest time and effort analyst. A user wants to know if a task is worth doing.

Task: "${task}"
What they get from it: "${gain}"
Their time estimate: ${estimatedMinutes} minutes${contextBlock}

Analyze this and respond with ONLY valid JSON (no markdown, no code blocks, no extra text):
{
  "worthIt": true or false,
  "verdict": "one punchy sentence verdict (max 12 words)",
  "realisticMinutes": realistic time in minutes as a number,
  "reasoning": "2-3 sentences explaining why it is or isn't worth it, and why the realistic time differs",
  "hiddenSteps": ["specific step they forgot 1", "specific step they forgot 2", "specific step they forgot 3"]
}

Rules:
- Be honest and specific to what they actually described. Don't make generic assumptions.
- hiddenSteps must be relevant to THIS specific task — not generic ones like "prep time" if they're just going to a hotel pool
- realisticMinutes should reflect the actual task described — a hotel pool day is fun time, not labor
- Don't add cooking/cleaning steps if they're eating at a restaurant or hotel
- Don't add parking steps if they said valet
- verdict should be punchy and direct
- Family time, fun, vacation activities should almost always be worth it`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 512,
      }),
    });

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Groq error:", err);
    return NextResponse.json({
      worthIt: false,
      verdict: "Something went wrong.",
      realisticMinutes: estimatedMinutes,
      reasoning: "Couldn't analyze this right now.",
      hiddenSteps: [],
    }, { status: 500 });
  }
}
