"use client";

import { useState } from "react";

interface ReconFormProps {
  onSubmit: (title: string, gain: string, estimatedMinutes: number) => void;
}

export default function ReconForm({ onSubmit }: ReconFormProps) {
  const [title, setTitle] = useState("");
  const [gain, setGain] = useState("");
  const [hours, setHours] = useState("");
  const [mins, setMins] = useState("");

  const totalMins = (parseInt(hours || "0") * 60) + parseInt(mins || "0");
  const canSubmit = title.trim() && gain.trim() && totalMins > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(title.trim(), gain.trim(), totalMins);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-fade-in">
      <div>
        <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
          What's the task?
        </label>
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Drive to Costco to save $12 on paper towels..."
          rows={2}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500 resize-none transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
          What do you get from it?
        </label>
        <textarea
          value={gain}
          onChange={(e) => setGain(e.target.value)}
          placeholder="Save $12, feel organized, get out of the house..."
          rows={2}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500 resize-none transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
          How long do you think it'll take?
        </label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="number"
              min="0"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="0"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500 transition-colors pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">hrs</span>
          </div>
          <div className="flex-1 relative">
            <input
              type="number"
              min="0"
              max="59"
              value={mins}
              onChange={(e) => setMins(e.target.value)}
              placeholder="0"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500 transition-colors pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">min</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all ${
          canSubmit
            ? "bg-violet-600 hover:bg-violet-500 text-white"
            : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
        }`}
      >
        RUN RECON →
      </button>
    </form>
  );
}
