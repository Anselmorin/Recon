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
    <div className="flex flex-col gap-6 animate-pop">
      {/* Verdict badge */}
      <div className={`rounded-2xl p-6 border ${
        result.worthIt
          ? "bg-emerald-950/50 border-emerald-500/30"
          : "bg-red-950/50 border-red-500/30"
      }`}>
        <div className={`text-4xl font-black mb-2 ${result.worthIt ? "text-emerald-400" : "text-red-400"}`}>
          {result.worthIt ? "WORTH IT" : "SKIP IT"}
        </div>
        <p className="text-white font-medium">{result.verdict}</p>
      </div>

      {/* Task */}
      <div className="text-xs text-zinc-500 uppercase tracking-widest">
        Task: <span className="text-zinc-300 normal-case tracking-normal">{task}</span>
      </div>

      {/* Time breakdown */}
      <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Time Reality Check</p>
        <div className="flex items-end gap-4">
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">You think</p>
            <p className="text-2xl font-bold text-zinc-400">{formatTime(estimatedMinutes)}</p>
          </div>
          <div className="text-zinc-600 pb-1">→</div>
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Reality</p>
            <p className="text-2xl font-bold text-white">{formatTime(result.realisticMinutes)}</p>
          </div>
          {overrun > 0 && (
            <div className="ml-auto text-right">
              <p className="text-xs text-amber-500">+{formatTime(overrun)}</p>
              <p className="text-xs text-zinc-600">{overrunPct}% longer</p>
            </div>
          )}
        </div>
      </div>

      {/* Reasoning */}
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Why</p>
        <p className="text-zinc-300 text-sm leading-relaxed">{result.reasoning}</p>
      </div>

      {/* Hidden steps */}
      {result.hiddenSteps.length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">What you forgot</p>
          <div className="flex flex-col gap-2">
            {result.hiddenSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="text-zinc-600 mt-0.5">+</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {result.worthIt ? (
        <div className="flex gap-3 mt-2">
          <button
            onClick={onAccept}
            className="flex-1 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide transition-colors"
          >
            ADD TO QUEUE →
          </button>
          <button
            onClick={onReject}
            className="px-4 py-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm transition-colors"
          >
            Skip
          </button>
        </div>
      ) : (
        <button
          onClick={onReject}
          className="w-full py-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm tracking-wide transition-colors"
        >
          ← BACK TO START
        </button>
      )}
    </div>
  );
}
