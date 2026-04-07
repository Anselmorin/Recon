import { NextRequest, NextResponse } from "next/server";

function analyze(task: string, gain: string, estimatedMinutes: number, context: string[] = []) {
  const taskLower = task.toLowerCase();
  const gainLower = gain.toLowerCase();

  // Keywords that suggest complexity
  const complexKeywords = ["drive", "travel", "commute", "install", "setup", "build", "fix", "repair", "clean", "organize", "move", "buy", "shop", "cook", "plan", "research", "apply", "fill out", "sign up", "errand", "pick up", "drop off", "stop"];
  const quickKeywords = ["email", "text", "call", "check", "read", "watch", "look up", "google", "search"];
  const lowValueKeywords = ["maybe", "might", "could", "possibly", "sort of", "kinda"];
  const highValueKeywords = ["money", "save", "$", "health", "important", "deadline", "need", "must", "job", "school", "work"];

  // Detect task types for hidden steps + multipliers
  const isDriving = taskLower.match(/driv|car|ride|commut|travel|go to|head to|get to|pick up|drop off/);
  const isShopping = taskLower.match(/shop|store|buy|pick up|grab|purchase|errand|costco|target|walmart|grocery|market/);
  const isCooking = taskLower.match(/cook|bak|meal|recipe|food|make dinner|make lunch|prep/);
  const isCleaning = taskLower.match(/clean|tidy|organiz|declutter|sort|laundry|dishes|vacuum/);
  const isFixing = taskLower.match(/fix|repair|install|set up|setup|assembl|build|replace/);
  const isWorking = taskLower.match(/work|email|write|report|meeting|zoom|call|presentation|homework|essay/);
  const isExercise = taskLower.match(/gym|workout|run|walk|hike|swim|exercise|sport|tennis|surf/);
  const hasStopover = taskLower.match(/stop|detour|swing by|also|and then|on the way/);
  const hasErrand = taskLower.match(/errand|return|exchange|post office|bank|pharmacy|doctor|appointment/);

  const isComplex = complexKeywords.some(k => taskLower.includes(k));
  const isQuick = quickKeywords.some(k => taskLower.includes(k));
  const isLowValue = lowValueKeywords.some(k => gainLower.includes(k));
  const isHighValue = highValueKeywords.some(k => gainLower.includes(k));

  // Build hidden steps dynamically based on detected task types
  const hiddenSteps: string[] = [];

  if (isDriving) {
    hiddenSteps.push("Getting ready + walking to the car");
    hiddenSteps.push("Finding parking (always takes longer)");
  }
  if (isShopping) {
    hiddenSteps.push("Browsing longer than you planned");
    hiddenSteps.push("Checkout line");
  }
  if (isCooking) {
    hiddenSteps.push("Prep time before cooking even starts");
    hiddenSteps.push("Cleanup and dishes after");
  }
  if (isCleaning) {
    hiddenSteps.push("Gathering supplies and moving stuff out of the way");
    hiddenSteps.push("Putting everything back after");
  }
  if (isFixing) {
    hiddenSteps.push("Diagnosing the actual problem first");
    hiddenSteps.push("Troubleshooting when it doesn't go right");
  }
  if (isExercise) {
    hiddenSteps.push("Getting there and back");
    hiddenSteps.push("Shower + getting ready after");
  }
  if (hasStopover || hasErrand) {
    hiddenSteps.push("Stopover adds more time than you think");
  }
  if (isWorking) {
    hiddenSteps.push("Getting into focus mode (startup time)");
    hiddenSteps.push("Distractions and context-switching");
  }

  // Fallback if nothing detected
  if (hiddenSteps.length === 0) {
    hiddenSteps.push("Getting started (more than you'd think)");
    hiddenSteps.push("Unexpected interruptions");
    hiddenSteps.push("Finishing touches and cleanup");
  }

  // Cap at 4
  const finalHiddenSteps = hiddenSteps.slice(0, 4);

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
  if (isComplex) multiplier += 0.3;
  if (isQuick) multiplier = Math.max(1.1, multiplier - 0.2);
  if (estimatedMinutes < 15) multiplier += 0.2; // short tasks always take longer than you think
  if (isDriving) multiplier += 0.2; // driving always has surprises
  if (isShopping) multiplier += 0.15;
  if (isCooking) multiplier += 0.2; // prep + cleanup
  if (isCleaning) multiplier += 0.15;
  if (isFixing) multiplier += 0.35; // fixing always takes longer
  if (isExercise) multiplier += 0.3; // travel + shower
  if (hasStopover) multiplier += 0.2;
  if (hasErrand) multiplier += 0.15;
  // Context answers
  if (hasBadParking) multiplier += 0.2;
  if (hasHeavyTraffic) multiplier += 0.25;
  if (hasLines) multiplier += 0.15;
  if (hasNoIdea) multiplier += 0.2;
  if (hasBrowsing) multiplier += 0.15;
  if (hasShower) multiplier += 0.25;
  if (hasInterruptions) multiplier += 0.3;
  if (hasLowEnergy) multiplier += 0.2;
  if (hasFirstTime) multiplier += 0.4;
  if (hasMissingItems) multiplier += 0.5;

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

  return { worthIt, verdict, realisticMinutes, reasoning, hiddenSteps: finalHiddenSteps };
}

export async function POST(req: NextRequest) {
  const { task, gain, estimatedMinutes, context = [] } = await req.json();
  const result = analyze(task, gain, estimatedMinutes, context);
  return NextResponse.json(result);
}
