"use client";

import { useState } from "react";
import FeedbackModal from "./FeedbackModal";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-white transition-all shadow-lg"
        style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)", boxShadow: "0 4px 20px rgba(168,85,247,0.35)" }}
      >
        💬 Feedback
      </button>
      {open && <FeedbackModal onClose={() => setOpen(false)} />}
    </>
  );
}
