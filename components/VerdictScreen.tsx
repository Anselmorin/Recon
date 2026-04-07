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

const card = { background: "white", borderRadius: "20px", padding: "1.25rem", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" };

export default function VerdictScreen({ result, task, estimatedMinutes, onAccept, onReject }: VerdictScreenProps) {
  const overrun = result.realisticMinutes - estimatedMinutes;
  const overrunPct = Math.round((overrun / estimatedMinutes) * 100);

  return (
    <div className="flex flex-col gap-4 animate-pop">
      {/* Verdict */}
      <div className="rounded-3xl p-6" style={result.worthIt
        ? { background: "linear-gradient(135deg, #d1fae5, #a7f3d0)", border: "2px solid #6ee7b7" }
        : { background: "linear-gradient(135deg, #fee2e2, #fecaca)", border: "2px solid #f87171" }
      }>
        <div className="text-2xl mb-2" style={{ color: result.worthIt ? "#065f46" : "#991b1b" }}>
          {result.worthIt ? "✅ Worth it!" : "❌ Skip it"}
        </div>
        <p className="text-base" style={{ color: result.worthIt ? "#064e3b" : "#7f1d1d" }}>{result.verdict}</p>
      </div>

      {/* Task */}
      <div style={card}>
        <p className="text-xs mb-1" style={{ color: "#9ca3af" }}>Task</p>
        <p className="text-sm" style={{ color: "#374151" }}>{task}</p>
      </div>

      {/* Time */}
      <div style={{ ...card, background: "linear-gradient(135deg, #eff6ff, #f5f3ff)" }}>
        <p className="text-xs mb-4" style={{ color: "#6b7280" }}>⏱️ Time Reality Check</p>
        <div className="flex items-end gap-4">
          <div>
            <p className="text-xs mb-1" style={{ color: "#9ca3af" }}>You think</p>
            <p className="text-2xl" style={{ color: "#9ca3af" }}>{formatTime(estimatedMinutes)}</p>
          </div>
          <div className="pb-1 text-lg" style={{ color: "#d1d5db" }}>→</div>
          <div>
            <p className="text-xs mb-1" style={{ color: "#9ca3af" }}>Reality</p>
            <p className="text-2xl" style={{ color: "#1a1a2e" }}>{formatTime(result.realisticMinutes)}</p>
          </div>
          {overrun > 0 && (
            <div className="ml-auto text-right">
              <p className="text-sm" style={{ color: "#f59e0b" }}>+{formatTime(overrun)}</p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>{overrunPct}% longer</p>
            </div>
          )}
        </div>
      </div>

      {/* Why */}
      <div style={card}>
        <p className="text-xs mb-2" style={{ color: "#9ca3af" }}>💬 Why</p>
        <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{result.reasoning}</p>
      </div>

      {/* Hidden steps */}
      {result.hiddenSteps.length > 0 && (
        <div style={{ ...card, background: "linear-gradient(135deg, #fefce8, #fff7ed)", border: "2px solid #fde68a" }}>
          <p className="text-xs mb-3" style={{ color: "#92400e" }}>🤦 What you probably forgot</p>
          <div className="flex flex-col gap-2">
            {result.hiddenSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-sm" style={{ color: "#78350f" }}>
                <span style={{ color: "#d97706" }}>+</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {result.worthIt ? (
        <div className="flex gap-3 mt-1">
          <button onClick={onAccept} className="flex-1 py-4 rounded-2xl text-sm text-white transition-all"
            style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)" }}>
            Add to Queue 📋
          </button>
          <button onClick={onReject} className="px-5 py-4 rounded-2xl text-sm transition-all"
            style={{ background: "white", color: "#9ca3af", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            Skip
          </button>
        </div>
      ) : (
        <button onClick={onReject} className="w-full py-4 rounded-2xl text-sm transition-all mt-1"
          style={{ background: "white", color: "#374151", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          ← Start Over
        </button>
      )}
    </div>
  );
}
