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
      question: "🅿️ What's parking like?",
      options: ["Free & easy", "Paid parking", "Valet", "Street parking (ugh)", "No idea"],
    });
    followUps.push({
      id: "traffic",
      question: "🚦 What's traffic usually like?",
      options: ["Clear roads", "Light traffic", "Moderate", "Heavy / rush hour"],
    });
  }

  if (t.match(/shop|store|buy|pick up|grab|get|purchase|order|errand|grocery|market/)) {
    followUps.push({
      id: "lines",
      question: "🛒 How are the lines usually?",
      options: ["In and out", "Short wait", "Always a line", "Totally unpredictable"],
    });
    followUps.push({
      id: "know_what",
      question: "🎯 Do you know exactly what you need?",
      options: ["Yep, in and out", "Mostly yes", "Kind of browsing", "No idea what I want"],
    });
  }

  if (t.match(/cook|make|bak|prep|food|meal|recipe/)) {
    followUps.push({
      id: "cleanup",
      question: "🧹 Are you counting cleanup time?",
      options: ["Yeah, factored it in", "Oops, forgot that", "Someone else cleans", "Minimal mess"],
    });
    followUps.push({
      id: "ingredients",
      question: "🥕 Do you have everything you need?",
      options: ["All set!", "Need to check", "Missing a few things", "Need to shop first"],
    });
  }

  if (t.match(/clean|organiz|tidy|sort|declutter/)) {
    followUps.push({
      id: "scope",
      question: "📦 How big is the area?",
      options: ["Just one small spot", "A room", "Multiple rooms", "The whole place 😬"],
    });
  }

  if (t.match(/fix|repair|install|set up|setup|build|assembl/)) {
    followUps.push({
      id: "tools",
      question: "🔧 Do you have everything you need?",
      options: ["All set!", "Need to dig for tools", "Need to buy something", "No idea what I need"],
    });
    followUps.push({
      id: "done_before",
      question: "🤔 Have you done this before?",
      options: ["Yep, easy", "Once or twice", "Nope, first time", "No, but I YouTubed it 🙏"],
    });
  }

  if (t.match(/meet|call|zoom|appointment|interview|doctor|dentist/)) {
    followUps.push({
      id: "wait",
      question: "⏳ Is there usually a wait?",
      options: ["Always on time", "A few minutes", "Always runs late", "Total wildcard"],
    });
  }

  if (t.match(/workout|gym|exercise|run|walk|hike|swim|sport/)) {
    followUps.push({
      id: "getting_there",
      question: "📍 How far away is it?",
      options: ["At home, no travel", "5 min away", "15–30 min away", "Far drive"],
    });
    followUps.push({
      id: "shower",
      question: "🚿 Factoring in a shower after?",
      options: ["Yep!", "Oops, forgot that", "Won't need one", "I'll deal with it later"],
    });
  }

  if (followUps.length === 0) {
    followUps.push({
      id: "interruptions",
      question: "📵 How likely are interruptions?",
      options: ["Full focus mode", "Probably a few", "Definitely some", "I'll get derailed for sure"],
    });
    followUps.push({
      id: "energy",
      question: "⚡ What's your energy like right now?",
      options: ["Fully charged", "Pretty good", "A bit tired", "Running on fumes"],
    });
  }

  return followUps.slice(0, 3);
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
        <div className="bg-slate-800/60 rounded-2xl p-4">
          <p className="text-xs text-slate-400 mb-1">Your task</p>
          <p className="text-slate-200 text-sm font-medium">{title}</p>
        </div>

        <p className="text-slate-400 text-sm">A couple quick questions to sharpen the estimate 👇</p>

        <div className="flex flex-col gap-6">
          {followUps.map((f) => (
            <div key={f.id}>
              <p className="text-base font-semibold text-white mb-3">{f.question}</p>
              <div className="flex flex-col gap-2">
                {f.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => selectAnswer(f.id, opt)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border-2 ${
                      answers[f.id] === opt
                        ? "border-violet-400 bg-violet-500/15 text-violet-200 font-medium"
                        : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:text-slate-300"
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
            className="px-5 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-sm transition-colors font-medium"
          >
            ← Back
          </button>
          <button
            onClick={handleFinalSubmit}
            disabled={!allAnswered}
            className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all ${
              allAnswered
                ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20"
                : "bg-slate-800 text-slate-600 cursor-not-allowed"
            }`}
          >
            Run Recon 🔍
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleMainNext} className="flex flex-col gap-5 animate-fade-in">
      {/* Think hint */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3">
        <p className="text-xs font-bold text-amber-400 mb-1">💡 Think about:</p>
        <p className="text-xs text-amber-300/70 leading-relaxed">
          Driving · Traffic · Parking · Getting ready · Lines · Stopovers · Errands along the way · Cleanup after · Tools needed · Getting back
        </p>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-300 mb-2 block">
          What's the task?
        </label>
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Drive to Costco to save $12 on paper towels..."
          rows={2}
          className="w-full bg-slate-800/60 border-2 border-slate-700 rounded-2xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 resize-none transition-colors"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-300 mb-2 block">
          What do you get out of it?
        </label>
        <textarea
          value={gain}
          onChange={(e) => setGain(e.target.value)}
          placeholder="e.g. Save $12, feel productive, get out of the house..."
          rows={2}
          className="w-full bg-slate-800/60 border-2 border-slate-700 rounded-2xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 resize-none transition-colors"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-300 mb-2 block">
          How long do you <em>think</em> it'll take?
        </label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="number"
              min="0"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-800/60 border-2 border-slate-700 rounded-2xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">hrs</span>
          </div>
          <div className="flex-1 relative">
            <input
              type="number"
              min="0"
              max="59"
              value={mins}
              onChange={(e) => setMins(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-800/60 border-2 border-slate-700 rounded-2xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">min</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!canSubmitMain}
        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all mt-1 ${
          canSubmitMain
            ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20"
            : "bg-slate-800 text-slate-600 cursor-not-allowed"
        }`}
      >
        Next →
      </button>
    </form>
  );
}
