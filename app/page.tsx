"use client";

import { useState } from "react";
import { Task, ReconResult } from "@/lib/types";
import ReconForm from "@/components/ReconForm";
import VerdictScreen from "@/components/VerdictScreen";
import TaskQueue from "@/components/TaskQueue";

type Screen = "form" | "loading" | "verdict" | "queue";

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>("form");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pendingTask, setPendingTask] = useState<{ title: string; gain: string; estimatedMinutes: number } | null>(null);
  const [lastResult, setLastResult] = useState<ReconResult | null>(null);

  const handleSubmit = async (title: string, gain: string, estimatedMinutes: number, context: string[]) => {
    setPendingTask({ title, gain, estimatedMinutes });
    setScreen("loading");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: title, gain, estimatedMinutes, context }),
      });
      const result: ReconResult = await res.json();
      setLastResult(result);
      setScreen("verdict");
    } catch {
      setScreen("form");
    }
  };

  const handleAccept = () => {
    if (!pendingTask || !lastResult) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: pendingTask.title,
      description: pendingTask.gain,
      estimatedMinutes: pendingTask.estimatedMinutes,
      realisticMinutes: lastResult.realisticMinutes,
      worthIt: true,
      verdict: lastResult.verdict,
      gain: pendingTask.gain,
      addedAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    setScreen("queue");
    setPendingTask(null);
    setLastResult(null);
  };

  const handleReject = () => {
    setPendingTask(null);
    setLastResult(null);
    setScreen("form");
  };

  const handleRemoveTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const totalRealistic = tasks.reduce((sum, t) => sum + t.realisticMinutes, 0);
  const totalEstimated = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);

  return (
    <main className="min-h-screen flex flex-col max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">RECON</h1>
          <p className="text-xs text-zinc-500 tracking-widest uppercase">Scout before you commit</p>
        </div>
        {tasks.length > 0 && (
          <button
            onClick={() => setScreen(screen === "queue" ? "form" : "queue")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors"
          >
            <span>Queue</span>
            <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center font-bold">
              {tasks.length}
            </span>
          </button>
        )}
      </div>

      {/* Screens */}
      {screen === "form" && (
        <ReconForm onSubmit={handleSubmit} />
      )}

      {screen === "loading" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-fade-in">
          <div className="w-12 h-12 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-zinc-400 text-sm">Running recon...</p>
        </div>
      )}

      {screen === "verdict" && lastResult && pendingTask && (
        <VerdictScreen
          result={lastResult}
          task={pendingTask.title}
          estimatedMinutes={pendingTask.estimatedMinutes}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}

      {screen === "queue" && (
        <TaskQueue
          tasks={tasks}
          totalRealistic={totalRealistic}
          totalEstimated={totalEstimated}
          onRemove={handleRemoveTask}
          onAddMore={() => setScreen("form")}
        />
      )}
    </main>
  );
}
