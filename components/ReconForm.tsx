"use client";

import { useState } from "react";

interface ReconFormProps {
  onSubmit: (title: string, gain: string, estimatedMinutes: number, context: string[]) => void;
}

interface FollowUp {
  id: string;
  question: string;
  options: string[];
}

function getFollowUps(task: string): FollowUp[] {
  const t = task.toLowerCase();
  const followUps: FollowUp[] = [];

  if (t.match(/driv|car|ride|uber|lyft|commut|travel|trip|go to|head to|get to/)) {
    followUps.push({
      id: "parking",
      question: "What's parking like?",
      options: ["Free & easy", "Paid parking", "Valet", "Street parking (painful)", "No idea"],
    });
    followUps.push({
      id: "traffic",
      question: "What's traffic usually like?",
      options: ["Clear", "Light", "Moderate", "Heavy / rush hour"],
    });
  }

  if (t.match(/shop|store|buy|pick up|grab|get|purchase|order/)) {
    followUps.push({
      id: "lines",
      question: "How are the lines usually?",
      options: ["In and out", "Short wait", "Always a line", "Unpredictable"],
    });
    followUps.push({
      id: "know_what",
      question: "Do you know exactly what you need?",
      options: ["Yes, in and out", "Mostly yes", "Kind of browsing", "No idea what I want"],
    });
  }

  if (t.match(/cook|make|bak|prep|food|meal|recipe/)) {
    followUps.push({
      id: "cleanup",
      question: "Are you accounting for cleanup?",
      options: ["Yeah I factored it in", "Forgot about cleanup", "Someone else cleans", "Minimal mess"],
    });
    followUps.push({
      id: "ingredients",
      question: "Do you have all the ingredients?",
      options: ["Yes, all ready", "Need to check", "Missing a few things", "Need to shop first"],
    });
  }

  if (t.match(/clean|organiz|tidy|sort|declutter/)) {
    followUps.push({
      id: "scope",
      question: "How big is the area?",
      options: ["Just one small spot", "A room", "Multiple rooms", "The whole place"],
    });
  }

  if (t.match(/fix|repair|install|set up|setup|build|assembl/)) {
    followUps.push({
      id: "tools",
      question: "Do you have everything you need?",
      options: ["Yes, all set", "Need to find some tools", "Need to buy something first", "No idea what I need"],
    });
    followUps.push({
      id: "done_before",
      question: "Have you done this before?",
      options: ["Yes, easy", "Once or twice", "Never, first time", "No, but I YouTubed it"],
    });
  }

  if (t.match(/meet|call|zoom|appointment|interview|doctor|dentist/)) {
    followUps.push({
      id: "wait",
      question: "Is there usually a wait?",
      options: ["No, on time always", "A few minutes", "Always runs late", "Unpredictable"],
    });
    followUps.push({
      id: "prep",
      question: "Do you need to prepare anything beforehand?",
      options: ["No prep needed", "A little", "Yes, significant prep", "Should but probably won't"],
    });
  }

  if (t.match(/email|write|message|respond|reply|fill out|form|application/)) {
    followUps.push({
      id: "drafts",
      question: "Do you know what to say?",
      options: ["Yes, just need to type it", "Mostly, some thinking needed", "Need to figure it out", "No idea how to approach it"],
    });
  }

  if (t.match(/workout|gym|exercise|run|walk|hike|swim|sport/)) {
    followUps.push({
      id: "getting_there",
      question: "Getting there + back?",
      options: ["At home, no travel", "5 min away", "15-30 min away", "Need to drive far"],
    });
    followUps.push({
      id: "shower",
      question: "Are you factoring in a shower after?",
      options: ["Yes", "No (oops)", "I won't need one", "I'll do it later"],
    });
  }

  // Always add this one if there are no specific ones
  if (followUps.length === 0) {
    followUps.push({
      id: "interruptions",
      question: "How likely are interruptions?",
      options: ["I'll have full focus", "Probably a few", "Definitely some", "I'll be constantly interrupted"],
    });
    followUps.push({
      id: "energy",
      question: "What's your energy level right now?",
      options: ["Fully energized", "Pretty good", "A bit tired", "Running on empty"],
    });
  }

  return followUps.slice(0, 3); // max 3 follow-ups
}

export default function ReconForm({ onSubmit }: ReconFormProps) {
  const [step, setStep] = useState<"main" | "followup">("main");
  const [title, setTitle] = useState("");
  const [gain, setGain] = useState("");
  const [hours, setHours] = useState("");
  const [mins, setMins] = useState("");
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const totalMins = (parseInt(hours || "0") * 60) + parseInt(mins || "0");
  const canSubmitMain = title.trim() && gain.trim() && totalMins > 0;
  const allAnswered = followUps.every(f => answers[f.id]);

  const handleMainNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitMain) return;
    const fups = getFollowUps(title);
    setFollowUps(fups);
    if (fups.length > 0) {
      setStep("followup");
    } else {
      onSubmit(title.trim(), gain.trim(), totalMins, []);
    }
  };

  const handleFinalSubmit = () => {
    const contextLines = followUps.map(f => `${f.question} → ${answers[f.id] || "not answered"}`);
    onSubmit(title.trim(), gain.trim(), totalMins, contextLines);
  };

  const selectAnswer = (id: string, option: string) => {
    setAnswers(prev => ({ ...prev, [id]: option }));
  };

  if (step === "followup") {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Task</p>
          <p className="text-zinc-300 text-sm">{title}</p>
        </div>

        <div className="w-full h-px bg-zinc-800" />

        <div className="flex flex-col gap-6">
          {followUps.map((f) => (
            <div key={f.id}>
              <p className="text-sm font-medium text-zinc-200 mb-3">{f.question}</p>
              <div className="flex flex-col gap-2">
                {f.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => selectAnswer(f.id, opt)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                      answers[f.id] === opt
                        ? "border-violet-500 bg-violet-500/10 text-violet-300"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={() => setStep("main")}
            className="px-4 py-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleFinalSubmit}
            disabled={!allAnswered}
            className={`flex-1 py-4 rounded-xl font-bold text-sm tracking-wide transition-all ${
              allAnswered
                ? "bg-violet-600 hover:bg-violet-500 text-white"
                : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            }`}
          >
            RUN RECON →
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleMainNext} className="flex flex-col gap-6 animate-fade-in">
      <div>
        <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
          What's the task?
        </label>
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Drive to Costco to save $12 on paper towels..."
          rows={2}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500 resize-none transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
          What do you get from it?
        </label>
        <textarea
          value={gain}
          onChange={(e) => setGain(e.target.value)}
          placeholder="Save $12, feel organized, get out of the house..."
          rows={2}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500 resize-none transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
          How long do you think it'll take?
        </label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="number"
              min="0"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="0"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500 transition-colors pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">hrs</span>
          </div>
          <div className="flex-1 relative">
            <input
              type="number"
              min="0"
              max="59"
              value={mins}
              onChange={(e) => setMins(e.target.value)}
              placeholder="0"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500 transition-colors pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">min</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!canSubmitMain}
        className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all ${
          canSubmitMain
            ? "bg-violet-600 hover:bg-violet-500 text-white"
            : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
        }`}
      >
        NEXT →
      </button>
    </form>
  );
}
