import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { task, gain, estimatedMinutes } = await req.json();

  const prompt = `You are a brutally honest time and effort analyst. A user wants to know if a task is worth doing.

Task: "${task}"
What they get from it: "${gain}"
Their time estimate: ${estimatedMinutes} minutes

Analyze this and respond with ONLY valid JSON (no markdown, no code blocks):
{
  "worthIt": true or false,
  "verdict": "one punchy sentence verdict (max 12 words)",
  "realisticMinutes": realistic time in minutes as a number,
  "reasoning": "2-3 sentences explaining why it is or isn't worth it, and why it takes longer",
  "hiddenSteps": ["step they forgot 1", "step they forgot 2", "step they forgot 3"]
}

Rules:
- Be honest, not motivational. If it's not worth it, say so clearly.
- hiddenSteps are the tasks-within-the-task they didn't account for (max 4, min 1)
- realisticMinutes should almost always be higher than their estimate (people underestimate)
- verdict should be punchy and direct, like a friend giving real talk`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini raw response:", JSON.stringify(data).slice(0, 500));
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (!text) {
      console.error("No text from Gemini:", data);
      throw new Error("No response from Gemini");
    }
    // Strip markdown code blocks if present
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Recon API error:", err);
    return NextResponse.json({
      worthIt: false,
      verdict: "Something went wrong.",
      realisticMinutes: estimatedMinutes,
      reasoning: "Couldn't analyze this right now.",
      hiddenSteps: [],
    }, { status: 500 });
  }
}
