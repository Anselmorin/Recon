import { NextRequest, NextResponse } from "next/server";

function analyze(task: string, gain: string, estimatedMinutes: number, context: string[] = []) {
  const taskLower = task.toLowerCase();
  const gainLower = gain.toLowerCase();

  // Keywords that suggest complexity
  const complexKeywords = ["drive", "travel", "commute", "install", "setup", "build", "fix", "repair", "clean", "organize", "move", "buy", "shop", "cook", "plan", "research", "apply", "fill out", "sign up"];
  const quickKeywords = ["email", "text", "call", "check", "read", "watch", "look up", "google", "search"];
  const lowValueKeywords = ["maybe", "might", "could", "possibly", "sort of", "kinda"];
  const highValueKeywords = ["money", "save", "$", "health", "important", "deadline", "need", "must", "job", "school", "work"];

  const isComplex = complexKeywords.some(k => taskLower.includes(k));
  const isQuick = quickKeywords.some(k => taskLower.includes(k));
  const isLowValue = lowValueKeywords.some(k => gainLower.includes(k));
  const isHighValue = highValueKeywords.some(k => gainLower.includes(k));

  // Hidden steps based on task type
  const hiddenStepsMap: Record<string, string[]> = {
    drive: ["Finding parking", "Traffic you didn't account for", "Getting ready to leave"],
    shop: ["Browsing longer than planned", "Checkout line", "Getting to and from the car"],
    cook: ["Prep and cleanup time", "Waiting for it to heat up", "Doing the dishes after"],
    clean: ["Gathering supplies", "Moving things out of the way", "Putting everything back"],
    install: ["Reading the instructions", "Troubleshooting when it doesn't work", "Restarting/testing"],
    fix: ["Diagnosing the actual problem", "Getting the right tools", "Testing the fix"],
    build: ["Planning and gathering materials", "Mistakes you'll have to redo", "Cleanup after"],
    research: ["Going down rabbit holes", "Cross-checking sources", "Writing it down"],
    default: ["Getting started (startup time)", "Unexpected interruptions", "Finishing touches"],
  };

  let hiddenSteps = hiddenStepsMap.default;
  for (const [key, steps] of Object.entries(hiddenStepsMap)) {
    if (taskLower.includes(key)) {
      hiddenSteps = steps;
      break;
    }
  }

  // Factor in context answers
  const contextStr = context.join(" ").toLowerCase();
  const hasBadParking = contextStr.includes("valet") || contextStr.includes("street parking") || contextStr.includes("paid parking");
  const hasHeavyTraffic = contextStr.includes("heavy") || contextStr.includes("rush hour");
  const hasLines = contextStr.includes("always a line") || contextStr.includes("unpredictable");
  const hasNoIdea = contextStr.includes("no idea");
  const hasBrowsing = contextStr.includes("browsing");
  const hasShower = contextStr.includes("oops");
  const hasInterruptions = contextStr.includes("constantly interrupted") || contextStr.includes("definitely some");
  const hasLowEnergy = contextStr.includes("running on empty") || contextStr.includes("a bit tired");
  const hasFirstTime = contextStr.includes("first time") || contextStr.includes("never");
  const hasMissingItems = contextStr.includes("need to buy") || contextStr.includes("need to shop") || contextStr.includes("missing a few");

  // Realistic time multiplier
  let multiplier = 1.3; // baseline — people always underestimate
  if (isComplex) multiplier += 0.4;
  if (isQuick) multiplier = Math.max(1.1, multiplier - 0.2);
  if (estimatedMinutes < 15) multiplier += 0.2; // short tasks always take longer than you think
  if (hasBadParking) multiplier += 0.2;
  if (hasHeavyTraffic) multiplier += 0.25;
  if (hasLines) multiplier += 0.15;
  if (hasNoIdea) multiplier += 0.2;
  if (hasBrowsing) multiplier += 0.15;
  if (hasShower) multiplier += 0.25; // forgot the shower
  if (hasInterruptions) multiplier += 0.3;
  if (hasLowEnergy) multiplier += 0.2;
  if (hasFirstTime) multiplier += 0.4;
  if (hasMissingItems) multiplier += 0.5; // need to shop first = double the time

  const realisticMinutes = Math.round(estimatedMinutes * multiplier);

  // Worth it scoring — also factor context
  let score = 50; // neutral
  if (hasBadParking && !isHighValue) score -= 10;
  if (hasHeavyTraffic && !isHighValue) score -= 10;
  if (hasLowEnergy) score -= 5;
  if (hasMissingItems) score -= 15;
  if (isHighValue) score += 25;
  if (isLowValue) score -= 20;
  if (isComplex && !isHighValue) score -= 10;
  if (estimatedMinutes > 120) score -= 15; // big time investment needs big payoff
  if (realisticMinutes > estimatedMinutes * 1.5) score -= 10; // huge underestimate is a red flag

  const worthIt = score >= 50;

  // Generate verdict
  const verdicts = {
    highYes: ["Solid investment, do it.", "Worth your time, go for it.", "Clear payoff, don't skip this."],
    lowYes: ["Borderline, but probably worth it.", "Marginal win, your call.", "Slight edge toward doing it."],
    lowNo: ["Barely worth the effort.", "The juice isn't worth the squeeze.", "Questionable return on your time."],
    highNo: ["Hard pass. Not worth it.", "Skip it — cost outweighs the gain.", "Your time is worth more than this."],
  };

  let verdictList;
  if (worthIt && score >= 70) verdictList = verdicts.highYes;
  else if (worthIt) verdictList = verdicts.lowYes;
  else if (score >= 35) verdictList = verdicts.lowNo;
  else verdictList = verdicts.highNo;

  const verdict = verdictList[Math.floor(Math.random() * verdictList.length)];

  // Reasoning
  const timeNote = realisticMinutes > estimatedMinutes
    ? `This will probably take ${realisticMinutes} minutes, not ${estimatedMinutes} — people almost always underestimate.`
    : `Your time estimate seems reasonable for this.`;

  const valueNote = isHighValue
    ? "The payoff seems genuinely meaningful."
    : isLowValue
    ? "The gain sounds uncertain — factor that in."
    : "The payoff is decent but not exceptional.";

  const reasoning = `${timeNote} ${valueNote} ${worthIt ? "On balance, it's worth doing." : "On balance, your time is better spent elsewhere."}`;

  return { worthIt, verdict, realisticMinutes, reasoning, hiddenSteps };
}

export async function POST(req: NextRequest) {
  const { task, gain, estimatedMinutes, context = [] } = await req.json();
  const result = analyze(task, gain, estimatedMinutes, context);
  return NextResponse.json(result);
}
