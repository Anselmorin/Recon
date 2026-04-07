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
  const fu: FollowUp[] = [];
  if (t.match(/driv|car|ride|uber|lyft|commut|travel|trip|go to|head to|get to/)) {
    fu.push({ id: "drive_time", question: "🚗 How long is the drive (one way)?", options: ["Under 10 min", "10–20 min", "20–45 min", "45+ min"] });
    fu.push({ id: "parking", question: "🅿️ What's parking like?", options: ["Free & easy", "Paid parking", "Valet", "Street parking (ugh)", "No idea"] });
    fu.push({ id: "traffic", question: "🚦 Traffic situation?", options: ["Clear roads", "Light traffic", "Moderate", "Heavy / rush hour"] });
  }
  if (t.match(/shop|store|buy|pick up|grab|purchase|errand|grocery|market/)) {
    fu.push({ id: "lines", question: "🛒 How are the lines usually?", options: ["In and out", "Short wait", "Always a line", "Totally unpredictable"] });
    fu.push({ id: "know_what", question: "🎯 Know exactly what you need?", options: ["Yep, in and out", "Mostly yes", "Kind of browsing", "No idea what I want"] });
  }
  if (t.match(/cook|make|bak|prep|food|meal|recipe/)) {
    fu.push({ id: "cleanup", question: "🧹 Counting cleanup time?", options: ["Yeah, factored it in", "Oops, forgot that", "Someone else cleans", "Minimal mess"] });
    fu.push({ id: "ingredients", question: "🥕 Have everything you need?", options: ["All set!", "Need to check", "Missing a few things", "Need to shop first"] });
  }
  if (t.match(/clean|organiz|tidy|sort|declutter/)) {
    fu.push({ id: "scope", question: "📦 How big is the area?", options: ["Just one small spot", "A room", "Multiple rooms", "The whole place 😬"] });
  }
  if (t.match(/fix|repair|install|set up|setup|build|assembl/)) {
    fu.push({ id: "tools", question: "🔧 Have everything you need?", options: ["All set!", "Need to dig for tools", "Need to buy something", "No idea what I need"] });
    fu.push({ id: "done_before", question: "🤔 Done this before?", options: ["Yep, easy", "Once or twice", "Nope, first time", "No, but I YouTubed it 🙏"] });
  }
  if (t.match(/meet|call|zoom|appointment|interview|doctor|dentist/)) {
    fu.push({ id: "wait", question: "⏳ Usually a wait?", options: ["Always on time", "A few minutes", "Always runs late", "Total wildcard"] });
  }
  if (t.match(/workout|gym|exercise|run|walk|hike|swim|sport/)) {
    fu.push({ id: "getting_there", question: "📍 How far away?", options: ["At home, no travel", "5 min away", "15–30 min away", "Far drive"] });
    fu.push({ id: "shower", question: "🚿 Factoring in a shower after?", options: ["Yep!", "Oops, forgot that", "Won't need one", "I'll deal later"] });
  }
  if (fu.length === 0) {
    fu.push({ id: "interruptions", question: "📵 How likely are interruptions?", options: ["Full focus mode", "Probably a few", "Definitely some", "I'll get derailed for sure"] });
    fu.push({ id: "energy", question: "⚡ Energy level right now?", options: ["Fully charged", "Pretty good", "A bit tired", "Running on fumes"] });
  }
  // Allow up to 4 for driving (drive time + parking + traffic + one more)
  const isDriving = t.match(/driv|car|ride|uber|lyft|commut|travel|trip|go to|head to|get to/);
  return fu.slice(0, isDriving ? 4 : 3);
}

const card = { background: "white", borderRadius: "20px", padding: "1.25rem", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" };
const input = { background: "white", border: "2px solid #e5e7eb", borderRadius: "16px", padding: "12px 16px", color: "#1a1a2e", width: "100%", fontSize: "0.875rem", outline: "none" };

export default function ReconForm({ onSubmit }: ReconFormProps) {
  const [step, setStep] = useState<"main" | "followup">("main");
  const [title, setTitle] = useState("");
  const [gain, setGain] = useState("");
  const [hours, setHours] = useState("");
  const [mins, setMins] = useState("");
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const totalMins = (parseInt(hours || "0") * 60) + parseInt(mins || "0");
  const canSubmit = title.trim() && gain.trim() && totalMins > 0;
  const allAnswered = followUps.every(f => answers[f.id]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const fups = getFollowUps(title);
    setFollowUps(fups);
    if (fups.length > 0) setStep("followup");
    else onSubmit(title.trim(), gain.trim(), totalMins, []);
  };

  if (step === "followup") {
    return (
      <div className="flex flex-col gap-5 animate-fade-in">
        <div style={card}>
          <p className="text-xs mb-1" style={{ color: "#9ca3af" }}>Your task</p>
          <p className="text-sm" style={{ color: "#374151" }}>{title}</p>
        </div>

        <p className="text-sm" style={{ color: "#6b7280" }}>A couple quick questions to sharpen the estimate 👇</p>

        {followUps.map((f) => (
          <div key={f.id} style={card}>
            <p className="text-base mb-3" style={{ color: "#1a1a2e" }}>{f.question}</p>
            <div className="flex flex-col gap-2">
              {f.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAnswers(prev => ({ ...prev, [f.id]: opt }))}
                  className="w-full text-left px-4 py-3 rounded-2xl text-sm transition-all"
                  style={answers[f.id] === opt
                    ? { background: "linear-gradient(135deg, #fdf4ff, #eff6ff)", border: "2px solid #a855f7", color: "#7c3aed" }
                    : { background: "#f9fafb", border: "2px solid #e5e7eb", color: "#6b7280" }
                  }
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <button onClick={() => setStep("main")} className="px-5 py-4 rounded-2xl text-sm transition-all" style={{ background: "white", color: "#9ca3af", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            ← Back
          </button>
          <button
            onClick={() => onSubmit(title.trim(), gain.trim(), totalMins, followUps.map(f => `${f.question} → ${answers[f.id] || ""}`))}
            disabled={!allAnswered}
            className="flex-1 py-4 rounded-2xl text-sm text-white transition-all"
            style={{ background: allAnswered ? "linear-gradient(135deg, #a855f7, #3b82f6, #10b981)" : "#e5e7eb", color: allAnswered ? "white" : "#9ca3af" }}
          >
            Run Recon 🔍
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleNext} className="flex flex-col gap-4 animate-fade-in">
      {/* Think hint */}
      <div className="rounded-2xl px-4 py-3" style={{ background: "linear-gradient(135deg, #fefce8, #fff7ed)", border: "2px solid #fde68a" }}>
        <p className="text-xs mb-1" style={{ color: "#d97706" }}>💡 Think about:</p>
        <p className="text-xs leading-relaxed" style={{ color: "#92400e" }}>
          Driving · Traffic · Parking · Getting ready · Lines · Stopovers · Errands · Cleanup · Tools · Getting back
        </p>
      </div>

      <div style={card}>
        <label className="text-sm mb-2 block" style={{ color: "#374151" }}>What&apos;s the task?</label>
        <textarea value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Drive to the store to grab ingredients..." rows={2}
          className="resize-none focus:outline-none w-full text-sm" style={{ ...input, padding: "10px 0", border: "none", background: "transparent", color: "#1a1a2e" }} />
      </div>

      <div style={card}>
        <label className="text-sm mb-2 block" style={{ color: "#374151" }}>What do you get out of it?</label>
        <textarea value={gain} onChange={e => setGain(e.target.value)} placeholder="e.g. Save money, feel productive, get it done..." rows={2}
          className="resize-none focus:outline-none w-full text-sm" style={{ ...input, padding: "10px 0", border: "none", background: "transparent", color: "#1a1a2e" }} />
      </div>

      <div style={card}>
        <label className="text-sm mb-3 block" style={{ color: "#374151" }}>How long do you <em>think</em> it&apos;ll take?</label>
        <div className="flex gap-3">
          {(["hrs", "min"] as const).map((label) => (
            <div key={label} className="flex-1 relative">
              <input type="number" min="0" max={label === "min" ? 59 : undefined}
                value={label === "hrs" ? hours : mins}
                onChange={e => label === "hrs" ? setHours(e.target.value) : setMins(e.target.value)}
                placeholder="0"
                className="focus:outline-none text-sm"
                style={{ ...input, paddingRight: "40px" }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs" style={{ color: "#9ca3af" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={!canSubmit} className="w-full py-4 rounded-2xl text-sm text-white transition-all"
        style={{ background: canSubmit ? "linear-gradient(135deg, #f43f5e, #a855f7, #3b82f6)" : "#e5e7eb", color: canSubmit ? "white" : "#9ca3af" }}>
        Next →
      </button>
    </form>
  );
}
