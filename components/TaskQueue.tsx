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

const RAINBOW_COLORS = ["#f472b6", "#a78bfa", "#60a5fa", "#34d399", "#fbbf24", "#f87171"];
const card = { background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "1.25rem" };

export default function TaskQueue({ tasks, totalRealistic, totalEstimated, onRemove, onAddMore }: TaskQueueProps) {
  const overrun = totalRealistic - totalEstimated;

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white">Your Queue 📋</h2>
        <p className="text-white/40 text-sm mt-0.5">Here&apos;s the honest truth about your day</p>
      </div>

      {/* Total */}
      <div style={{ background: "rgba(255,255,255,0.05)", border: "2px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "1.25rem" }}>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-4">⏱️ Total Time</p>
        <div className="flex items-end gap-4">
          <div>
            <p className="text-xs text-white/30 mb-1">You planned</p>
            <p className="text-2xl font-bold text-white/40">{formatTime(totalEstimated)}</p>
          </div>
          <div className="text-white/20 pb-1 text-lg">→</div>
          <div>
            <p className="text-xs text-white/30 mb-1">Reality</p>
            <p className="text-2xl font-bold text-white">{formatTime(totalRealistic)}</p>
          </div>
          {overrun > 0 && (
            <div className="ml-auto text-right">
              <p className="text-sm font-bold text-amber-400">+{formatTime(overrun)}</p>
              <p className="text-xs text-white/30">surprise time</p>
            </div>
          )}
        </div>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-3">
        {tasks.map((task, i) => (
          <div key={task.id} className="flex items-start gap-3 rounded-2xl p-4" style={card}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
              style={{ background: RAINBOW_COLORS[i % RAINBOW_COLORS.length] + "30", border: `1.5px solid ${RAINBOW_COLORS[i % RAINBOW_COLORS.length]}60`, color: RAINBOW_COLORS[i % RAINBOW_COLORS.length] }}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/90 text-sm font-medium leading-snug">{task.title}</p>
              <p className="text-white/30 text-xs mt-1">~{formatTime(task.realisticMinutes)} realistic</p>
            </div>
            <button onClick={() => onRemove(task.id)} className="text-white/20 hover:text-red-400 transition-colors text-xl leading-none mt-0.5 shrink-0">×</button>
          </div>
        ))}
      </div>

      <button
        onClick={onAddMore}
        className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all"
        style={{ background: "linear-gradient(135deg, #a78bfa, #60a5fa, #34d399)" }}
      >
        + Add Another Task
      </button>
    </div>
  );
}
