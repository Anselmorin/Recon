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

const COLORS = ["#f43f5e", "#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#06b6d4"];
const card = { background: "white", borderRadius: "20px", padding: "1.25rem", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" };

export default function TaskQueue({ tasks, totalRealistic, totalEstimated, onRemove, onAddMore }: TaskQueueProps) {
  const overrun = totalRealistic - totalEstimated;

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div>
        <h2 className="text-xl" style={{ color: "#1a1a2e" }}>Your Queue 📋</h2>
        <p className="text-sm mt-0.5" style={{ color: "#6b7280" }}>Here&apos;s the honest truth about your day</p>
      </div>

      {/* Total */}
      <div className="rounded-3xl p-5" style={{ background: "linear-gradient(135deg, #fdf4ff, #eff6ff, #f0fdf4)", border: "2px solid #e9d5ff" }}>
        <p className="text-xs mb-4" style={{ color: "#6b7280" }}>⏱️ Total Time</p>
        <div className="flex items-end gap-4">
          <div>
            <p className="text-xs mb-1" style={{ color: "#9ca3af" }}>You planned</p>
            <p className="text-2xl" style={{ color: "#9ca3af" }}>{formatTime(totalEstimated)}</p>
          </div>
          <div className="pb-1 text-lg" style={{ color: "#d1d5db" }}>→</div>
          <div>
            <p className="text-xs mb-1" style={{ color: "#9ca3af" }}>Reality</p>
            <p className="text-2xl" style={{ color: "#1a1a2e" }}>{formatTime(totalRealistic)}</p>
          </div>
          {overrun > 0 && (
            <div className="ml-auto text-right">
              <p className="text-sm" style={{ color: "#f59e0b" }}>+{formatTime(overrun)}</p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>surprise time</p>
            </div>
          )}
        </div>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-3">
        {tasks.map((task, i) => (
          <div key={task.id} className="flex items-start gap-3 rounded-2xl p-4" style={card}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white shrink-0 mt-0.5"
              style={{ background: COLORS[i % COLORS.length] }}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-snug truncate" style={{ color: "#1a1a2e" }}>{task.title}</p>
              <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>~{formatTime(task.realisticMinutes)} realistic</p>
            </div>
            <button onClick={() => onRemove(task.id)} className="text-xl leading-none mt-0.5 shrink-0 transition-colors hover:text-red-400" style={{ color: "#d1d5db" }}>×</button>
          </div>
        ))}
      </div>

      <button onClick={onAddMore} className="w-full py-4 rounded-2xl text-sm text-white transition-all"
        style={{ background: "linear-gradient(135deg, #f43f5e, #a855f7, #3b82f6, #10b981)" }}>
        + Add Another Task
      </button>
    </div>
  );
}
