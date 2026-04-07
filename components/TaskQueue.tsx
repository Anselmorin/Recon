"use client";

import { Task } from "@/lib/types";

interface TaskQueueProps {
  tasks: Task[];
  totalRealistic: number;
  totalEstimated: number;
  onRemove: (id: string) => void;
  onAddMore: () => void;
}

function formatTime(mins: number) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function TaskQueue({
  tasks,
  totalRealistic,
  totalEstimated,
  onRemove,
  onAddMore,
}: TaskQueueProps) {
  const overrun = totalRealistic - totalEstimated;

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white">Your Queue 📋</h2>
        <p className="text-slate-400 text-sm mt-0.5">Here's the honest truth about your day</p>
      </div>

      {/* Total */}
      <div className="bg-slate-800/60 rounded-3xl p-5 border-2 border-slate-700">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">⏱️ Total Time</p>
        <div className="flex items-end gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">You planned</p>
            <p className="text-2xl font-bold text-slate-400">{formatTime(totalEstimated)}</p>
          </div>
          <div className="text-slate-600 pb-1 text-lg">→</div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Reality</p>
            <p className="text-2xl font-bold text-white">{formatTime(totalRealistic)}</p>
          </div>
          {overrun > 0 && (
            <div className="ml-auto text-right">
              <p className="text-sm font-bold text-amber-400">+{formatTime(overrun)} surprise</p>
              <p className="text-xs text-slate-500">you didn't plan for</p>
            </div>
          )}
        </div>
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-3">
        {tasks.map((task, i) => (
          <div
            key={task.id}
            className="bg-slate-800/50 rounded-2xl p-4 flex items-start gap-3 border border-slate-700/50"
          >
            <div className="w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium leading-snug">{task.title}</p>
              <p className="text-slate-500 text-xs mt-1">~{formatTime(task.realisticMinutes)} realistic</p>
            </div>
            <button
              onClick={() => onRemove(task.id)}
              className="text-slate-600 hover:text-red-400 transition-colors text-xl leading-none mt-0.5 shrink-0"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onAddMore}
        className="w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-colors shadow-lg shadow-violet-500/20"
      >
        + Add Another Task
      </button>
    </div>
  );
}
