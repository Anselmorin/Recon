"use client";

import { useState } from "react";

interface FeedbackModalProps {
  onClose: () => void;
  verdictAccurate?: boolean | null; // pre-fill if coming from verdict screen
}

const ENDPOINT = "https://formspree.io/f/mpqobrqo";

export default function FeedbackModal({ onClose, verdictAccurate = null }: FeedbackModalProps) {
  const [accurate, setAccurate] = useState<boolean | null>(verdictAccurate);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          verdict_accurate: accurate === null ? "not rated" : accurate ? "yes" : "no",
          message: message.trim() || "(no message)",
          submitted_at: new Date().toLocaleString(),
        }),
      });
      if (res.ok) setStatus("done");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const card = { background: "white", borderRadius: "24px", padding: "1.5rem", boxShadow: "0 8px 40px rgba(0,0,0,0.12)", width: "100%", maxWidth: "400px" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div style={card} onClick={e => e.stopPropagation()}>
        {status === "done" ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🙌</div>
            <p className="text-lg" style={{ color: "#1a1a2e" }}>Thanks for the feedback!</p>
            <p className="text-sm mt-1 mb-4" style={{ color: "#9ca3af" }}>It helps make Recon better.</p>
            <button onClick={onClose} className="px-6 py-3 rounded-2xl text-white text-sm" style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)" }}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ color: "#1a1a2e" }}>💬 Feedback</h2>
              <button type="button" onClick={onClose} className="text-xl leading-none" style={{ color: "#d1d5db" }}>×</button>
            </div>

            {/* Was the verdict accurate? */}
            <div>
              <p className="text-sm mb-3" style={{ color: "#374151" }}>Was the time estimate accurate?</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAccurate(true)}
                  className="flex-1 py-3 rounded-2xl text-sm transition-all"
                  style={accurate === true
                    ? { background: "linear-gradient(135deg, #d1fae5, #a7f3d0)", border: "2px solid #6ee7b7", color: "#065f46" }
                    : { background: "#f9fafb", border: "2px solid #e5e7eb", color: "#6b7280" }
                  }
                >
                  👍 Yeah, pretty good
                </button>
                <button
                  type="button"
                  onClick={() => setAccurate(false)}
                  className="flex-1 py-3 rounded-2xl text-sm transition-all"
                  style={accurate === false
                    ? { background: "linear-gradient(135deg, #fee2e2, #fecaca)", border: "2px solid #f87171", color: "#991b1b" }
                    : { background: "#f9fafb", border: "2px solid #e5e7eb", color: "#6b7280" }
                  }
                >
                  👎 Not really
                </button>
              </div>
            </div>

            {/* Message */}
            <div>
              <p className="text-sm mb-2" style={{ color: "#374151" }}>Anything else? (optional)</p>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="What was off? What could be better?"
                rows={3}
                className="w-full rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none"
                style={{ background: "#f9fafb", border: "2px solid #e5e7eb", color: "#1a1a2e" }}
              />
            </div>

            {status === "error" && (
              <p className="text-xs text-red-400">Something went wrong — feedback not sent.</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-3.5 rounded-2xl text-sm text-white transition-all"
              style={{ background: "linear-gradient(135deg, #f43f5e, #a855f7, #3b82f6)", opacity: status === "sending" ? 0.6 : 1 }}
            >
              {status === "sending" ? "Sending..." : "Send Feedback →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
