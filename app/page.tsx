"use client";

import { useState } from "react";
import { Task, ReconResult } from "@/lib/types";
import ReconForm from "@/components/ReconForm";
import VerdictScreen from "@/components/VerdictScreen";
import TaskQueue from "@/components/TaskQueue";
import FeedbackButton from "@/components/FeedbackButton";

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
    setTasks(prev => [...prev, {
      id: crypto.randomUUID(),
      title: pendingTask.title,
      description: pendingTask.gain,
      estimatedMinutes: pendingTask.estimatedMinutes,
      realisticMinutes: lastResult.realisticMinutes,
      worthIt: true,
      verdict: lastResult.verdict,
      gain: pendingTask.gain,
      addedAt: new Date().toISOString(),
    }]);
    setScreen("queue");
    setPendingTask(null);
    setLastResult(null);
  };

  const totalRealistic = tasks.reduce((sum, t) => sum + t.realisticMinutes, 0);
  const totalEstimated = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);

  return (
    <main className="min-h-screen flex flex-col max-w-md mx-auto px-4 py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <h1 className="text-2xl rainbow-text">Recon</h1>
          </div>
          <p className="text-sm mt-0.5" style={{ color: "#6b7280" }}>Is it actually worth your time?</p>
        </div>
        {tasks.length > 0 && (
          <button
            onClick={() => setScreen(screen === "queue" ? "form" : "queue")}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all"
            style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", color: "#374151" }}
          >
            <span>📋 Queue</span>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
              style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)" }}>
              {tasks.length}
            </span>
          </button>
        )}
      </div>

      {screen === "form" && <ReconForm onSubmit={handleSubmit} />}

      {screen === "loading" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 animate-fade-in">
          <div className="text-6xl animate-bounce-slow">🔍</div>
          <div className="text-center">
            <p className="text-lg" style={{ color: "#1a1a2e" }}>Running your recon...</p>
            <p className="text-sm mt-1" style={{ color: "#9ca3af" }}>Crunching the real numbers ✨</p>
          </div>
        </div>
      )}

      {screen === "verdict" && lastResult && pendingTask && (
        <VerdictScreen
          result={lastResult}
          task={pendingTask.title}
          estimatedMinutes={pendingTask.estimatedMinutes}
          onAccept={handleAccept}
          onReject={() => { setPendingTask(null); setLastResult(null); setScreen("form"); }}
        />
      )}

      <FeedbackButton />

      {screen === "queue" && (
        <TaskQueue
          tasks={tasks}
          totalRealistic={totalRealistic}
          totalEstimated={totalEstimated}
          onRemove={(id) => setTasks(prev => prev.filter(t => t.id !== id))}
          onAddMore={() => setScreen("form")}
        />
      )}
    </main>
  );
}
