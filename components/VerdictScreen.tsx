"use client";

import { ReconResult } from "@/lib/types";

interface VerdictScreenProps {
  result: ReconResult;
  task: string;
  estimatedMinutes: number;
  onAccept: () => void;
  onReject: () => void;
}

function formatTime(mins: number) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

const card = { background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "1.25rem" };

export default function VerdictScreen({ result, task, estimatedMinutes, onAccept, onReject }: VerdictScreenProps) {
  const overrun = result.realisticMinutes - estimatedMinutes;
  const overrunPct = Math.round((overrun / estimatedMinutes) * 100);

  const verdictStyle = result.worthIt
    ? { background: "rgba(52,211,153,0.08)", border: "2px solid rgba(52,211,153,0.3)", borderRadius: "20px", padding: "1.5rem" }
    : { background: "rgba(248,113,113,0.08)", border: "2px solid rgba(248,113,113,0.3)", borderRadius: "20px", padding: "1.5rem" };

  return (
    <div className="flex flex-col gap-4 animate-pop">
      {/* Verdict */}
      <div style={verdictStyle}>
        <div className="text-2xl font-bold mb-2" style={{ color: result.worthIt ? "#34d399" : "#f87171" }}>
          {result.worthIt ? "✅ Worth it!" : "❌ Skip it"}
        </div>
        <p className="text-white font-medium text-base">{result.verdict}</p>
      </div>

      {/* Task */}
      <div style={card}>
        <p className="text-xs text-white/30 mb-1">Task</p>
        <p className="text-white/80 text-sm">{task}</p>
      </div>

      {/* Time */}
      <div style={card}>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-4">⏱️ Time Reality Check</p>
        <div className="flex items-end gap-4">
          <div>
            <p className="text-xs text-white/30 mb-1">You think</p>
            <p className="text-2xl font-bold text-white/40">{formatTime(estimatedMinutes)}</p>
          </div>
          <div className="text-white/20 pb-1 text-lg">→</div>
          <div>
            <p className="text-xs text-white/30 mb-1">Reality</p>
            <p className="text-2xl font-bold text-white">{formatTime(result.realisticMinutes)}</p>
          </div>
          {overrun > 0 && (
            <div className="ml-auto text-right">
              <p className="text-sm font-bold text-amber-400">+{formatTime(overrun)}</p>
              <p className="text-xs text-white/30">{overrunPct}% longer</p>
            </div>
          )}
        </div>
      </div>

      {/* Why */}
      <div style={card}>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2">💬 Why</p>
        <p className="text-white/70 text-sm leading-relaxed">{result.reasoning}</p>
      </div>

      {/* Hidden steps */}
      {result.hiddenSteps.length > 0 && (
        <div style={card}>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">🤦 What you probably forgot</p>
          <div className="flex flex-col gap-2">
            {result.hiddenSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                <span style={{ color: "rgba(255,255,255,0.2)" }} className="mt-0.5">+</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {result.worthIt ? (
        <div className="flex gap-3 mt-1">
          <button
            onClick={onAccept}
            className="flex-1 py-4 rounded-2xl font-bold text-sm text-white transition-all"
            style={{ background: "linear-gradient(135deg, #34d399, #60a5fa)" }}
          >
            Add to Queue 📋
          </button>
          <button onClick={onReject} className="px-5 py-4 rounded-2xl text-sm font-medium text-white/40 hover:text-white/70 transition-colors" style={{ background: "rgba(255,255,255,0.05)" }}>
            Skip
          </button>
        </div>
      ) : (
        <button onClick={onReject} className="w-full py-4 rounded-2xl font-bold text-sm text-white/80 transition-all mt-1" style={{ background: "rgba(255,255,255,0.07)" }}>
          ← Start Over
        </button>
      )}
    </div>
  );
}
