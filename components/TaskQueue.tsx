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
      {/* Total */}
      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Your Queue</p>
        <div className="flex items-end gap-4">
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">You think</p>
            <p className="text-2xl font-bold text-zinc-400">{formatTime(totalEstimated)}</p>
          </div>
          <div className="text-zinc-600 pb-1">→</div>
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Reality</p>
            <p className="text-2xl font-bold text-white">{formatTime(totalRealistic)}</p>
          </div>
          {overrun > 0 && (
            <div className="ml-auto text-right">
              <p className="text-xs text-amber-500">+{formatTime(overrun)} more</p>
              <p className="text-xs text-zinc-600">than you planned</p>
            </div>
          )}
        </div>
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex items-start gap-3"
          >
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{task.title}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{formatTime(task.realisticMinutes)} realistic</p>
            </div>
            <button
              onClick={() => onRemove(task.id)}
              className="text-zinc-600 hover:text-red-400 transition-colors text-lg leading-none mt-0.5"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onAddMore}
        className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm tracking-wide transition-colors"
      >
        + ADD ANOTHER TASK
      </button>
    </div>
  );
}
