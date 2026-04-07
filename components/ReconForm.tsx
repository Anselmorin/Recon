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
    followUps.push({ id: "parking", question: "🅿️ What's parking like?", options: ["Free & easy", "Paid parking", "Valet", "Street parking (ugh)", "No idea"] });
    followUps.push({ id: "traffic", question: "🚦 Traffic situation?", options: ["Clear roads", "Light traffic", "Moderate", "Heavy / rush hour"] });
  }
  if (t.match(/shop|store|buy|pick up|grab|purchase|errand|grocery|market/)) {
    followUps.push({ id: "lines", question: "🛒 How are the lines usually?", options: ["In and out", "Short wait", "Always a line", "Totally unpredictable"] });
    followUps.push({ id: "know_what", question: "🎯 Know exactly what you need?", options: ["Yep, in and out", "Mostly yes", "Kind of browsing", "No idea what I want"] });
  }
  if (t.match(/cook|make|bak|prep|food|meal|recipe/)) {
    followUps.push({ id: "cleanup", question: "🧹 Counting cleanup time?", options: ["Yeah, factored it in", "Oops, forgot that", "Someone else cleans", "Minimal mess"] });
    followUps.push({ id: "ingredients", question: "🥕 Have everything you need?", options: ["All set!", "Need to check", "Missing a few things", "Need to shop first"] });
  }
  if (t.match(/clean|organiz|tidy|sort|declutter/)) {
    followUps.push({ id: "scope", question: "📦 How big is the area?", options: ["Just one small spot", "A room", "Multiple rooms", "The whole place 😬"] });
  }
  if (t.match(/fix|repair|install|set up|setup|build|assembl/)) {
    followUps.push({ id: "tools", question: "🔧 Have everything you need?", options: ["All set!", "Need to dig for tools", "Need to buy something", "No idea what I need"] });
    followUps.push({ id: "done_before", question: "🤔 Done this before?", options: ["Yep, easy", "Once or twice", "Nope, first time", "No, but I YouTubed it 🙏"] });
  }
  if (t.match(/meet|call|zoom|appointment|interview|doctor|dentist/)) {
    followUps.push({ id: "wait", question: "⏳ Usually a wait?", options: ["Always on time", "A few minutes", "Always runs late", "Total wildcard"] });
  }
  if (t.match(/workout|gym|exercise|run|walk|hike|swim|sport/)) {
    followUps.push({ id: "getting_there", question: "📍 How far away?", options: ["At home, no travel", "5 min away", "15–30 min away", "Far drive"] });
    followUps.push({ id: "shower", question: "🚿 Factoring in a shower after?", options: ["Yep!", "Oops, forgot that", "Won't need one", "I'll deal later"] });
  }
  if (followUps.length === 0) {
    followUps.push({ id: "interruptions", question: "📵 How likely are interruptions?", options: ["Full focus mode", "Probably a few", "Definitely some", "I'll get derailed for sure"] });
    followUps.push({ id: "energy", question: "⚡ Energy level right now?", options: ["Fully charged", "Pretty good", "A bit tired", "Running on fumes"] });
  }

  return followUps.slice(0, 3);
}

const GRADIENT_BTN = "linear-gradient(135deg, #a78bfa, #60a5fa)";
const GRADIENT_GREEN = "linear-gradient(135deg, #34d399, #60a5fa)";

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
    if (fups.length > 0) setStep("followup");
    else onSubmit(title.trim(), gain.trim(), totalMins, []);
  };

  const handleFinalSubmit = () => {
    const ctx = followUps.map(f => `${f.question} → ${answers[f.id] || "not answered"}`);
    onSubmit(title.trim(), gain.trim(), totalMins, ctx);
  };

  const inputClass = "w-full rounded-2xl px-4 py-3 text-white text-sm focus:outline-none resize-none transition-all placeholder-white/25"
  const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)" };

  if (step === "followup") {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.08)" }}>
          <p className="text-xs text-white/40 mb-1">Your task</p>
          <p className="text-white/80 text-sm font-medium">{title}</p>
        </div>

        <p className="text-white/50 text-sm">A couple quick questions to sharpen the estimate 👇</p>

        <div className="flex flex-col gap-6">
          {followUps.map((f) => (
            <div key={f.id}>
              <p className="text-base font-semibold text-white mb-3">{f.question}</p>
              <div className="flex flex-col gap-2">
                {f.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers(prev => ({ ...prev, [f.id]: opt }))}
                    className="w-full text-left px-4 py-3 rounded-2xl text-sm transition-all font-medium"
                    style={answers[f.id] === opt
                      ? { background: "rgba(167,139,250,0.15)", border: "1.5px solid rgba(167,139,250,0.6)", color: "#c4b5fd" }
                      : { background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }
                    }
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-2">
          <button onClick={() => setStep("main")} className="px-5 py-4 rounded-2xl text-sm font-medium text-white/40 hover:text-white/70 transition-colors" style={{ background: "rgba(255,255,255,0.05)" }}>
            ← Back
          </button>
          <button
            onClick={handleFinalSubmit}
            disabled={!allAnswered}
            className="flex-1 py-4 rounded-2xl font-bold text-sm text-white transition-all"
            style={{ background: allAnswered ? GRADIENT_BTN : "rgba(255,255,255,0.05)", opacity: allAnswered ? 1 : 0.4 }}
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
      <div className="rounded-2xl px-4 py-3" style={{ background: "rgba(251,191,36,0.08)", border: "1.5px solid rgba(251,191,36,0.2)" }}>
        <p className="text-xs font-bold text-amber-400 mb-1">💡 Think about:</p>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(251,191,36,0.6)" }}>
          Driving · Traffic · Parking · Getting ready · Lines · Stopovers · Errands · Cleanup · Tools · Getting back
        </p>
      </div>

      <div>
        <label className="text-sm font-semibold text-white/70 mb-2 block">What&apos;s the task?</label>
        <textarea value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Drive to the store to grab ingredients..." rows={2} className={inputClass} style={inputStyle} />
      </div>

      <div>
        <label className="text-sm font-semibold text-white/70 mb-2 block">What do you get out of it?</label>
        <textarea value={gain} onChange={(e) => setGain(e.target.value)} placeholder="e.g. Save money, feel productive, get it done..." rows={2} className={inputClass} style={inputStyle} />
      </div>

      <div>
        <label className="text-sm font-semibold text-white/70 mb-2 block">How long do you <em>think</em> it&apos;ll take?</label>
        <div className="flex gap-3">
          {[["hours", hours, setHours, "hrs"], ["mins", mins, setMins, "min"]].map(([, val, setter, label]) => (
            <div key={label as string} className="flex-1 relative">
              <input
                type="number" min="0" max={label === "min" ? 59 : undefined}
                value={val as string}
                onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                placeholder="0"
                className="w-full rounded-2xl px-4 py-3 text-white text-sm focus:outline-none transition-all pr-12"
                style={inputStyle}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-white/30">{label as string}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!canSubmitMain}
        className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all mt-1"
        style={{ background: canSubmitMain ? GRADIENT_GREEN : "rgba(255,255,255,0.05)", opacity: canSubmitMain ? 1 : 0.4 }}
      >
        Next →
      </button>
    </form>
  );
}
