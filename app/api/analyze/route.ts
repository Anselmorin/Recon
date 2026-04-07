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
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 512,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || "{}";
    const result = JSON.parse(text);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({
      worthIt: false,
      verdict: "Something went wrong.",
      realisticMinutes: estimatedMinutes,
      reasoning: "Couldn't analyze this right now.",
      hiddenSteps: [],
    }, { status: 500 });
  }
}
