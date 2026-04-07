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

export default function VerdictScreen({
  result,
  task,
  estimatedMinutes,
  onAccept,
  onReject,
}: VerdictScreenProps) {
  const overrun = result.realisticMinutes - estimatedMinutes;
  const overrunPct = Math.round((overrun / estimatedMinutes) * 100);

  return (
    <div className="flex flex-col gap-5 animate-pop">
      {/* Verdict badge */}
      <div className={`rounded-3xl p-6 ${
        result.worthIt
          ? "bg-emerald-500/10 border-2 border-emerald-500/30"
          : "bg-red-500/10 border-2 border-red-500/30"
      }`}>
        <div className={`text-3xl font-black mb-2 flex items-center gap-2 ${result.worthIt ? "text-emerald-400" : "text-red-400"}`}>
          {result.worthIt ? "✅ Worth it!" : "❌ Skip it"}
        </div>
        <p className="text-white font-medium text-base">{result.verdict}</p>
      </div>

      {/* Task */}
      <div className="bg-slate-800/50 rounded-2xl px-4 py-3">
        <p className="text-xs text-slate-400 mb-0.5">Task</p>
        <p className="text-slate-200 text-sm">{task}</p>
      </div>

      {/* Time breakdown */}
      <div className="bg-slate-800/50 rounded-2xl p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">⏱️ Time Reality Check</p>
        <div className="flex items-end gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">You think</p>
            <p className="text-2xl font-bold text-slate-400">{formatTime(estimatedMinutes)}</p>
          </div>
          <div className="text-slate-600 pb-1 text-lg">→</div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Reality</p>
            <p className="text-2xl font-bold text-white">{formatTime(result.realisticMinutes)}</p>
          </div>
          {overrun > 0 && (
            <div className="ml-auto text-right">
              <p className="text-sm font-bold text-amber-400">+{formatTime(overrun)}</p>
              <p className="text-xs text-slate-500">{overrunPct}% longer</p>
            </div>
          )}
        </div>
      </div>

      {/* Reasoning */}
      <div className="bg-slate-800/50 rounded-2xl p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">💬 Why</p>
        <p className="text-slate-300 text-sm leading-relaxed">{result.reasoning}</p>
      </div>

      {/* Hidden steps */}
      {result.hiddenSteps.length > 0 && (
        <div className="bg-slate-800/50 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">🤦 What you probably forgot</p>
          <div className="flex flex-col gap-2">
            {result.hiddenSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-slate-500 mt-0.5">+</span>
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
            className="flex-1 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors shadow-lg shadow-emerald-500/20"
          >
            Add to Queue 📋
          </button>
          <button
            onClick={onReject}
            className="px-5 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-sm transition-colors font-medium"
          >
            Skip
          </button>
        </div>
      ) : (
        <button
          onClick={onReject}
          className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors mt-1"
        >
          ← Start Over
        </button>
      )}
    </div>
  );
}
