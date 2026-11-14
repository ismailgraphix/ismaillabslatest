"use client";
import { useState, useEffect } from "react";

export default function DatabaseErrorModal({ error }: { error?: string }) {
  const [open, setOpen] = useState(true);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-[var(--surface)] text-[var(--text)] rounded-lg p-8 max-w-md w-full shadow-2xl relative border border-[var(--border)]">
        <button onClick={() => setOpen(false)} aria-label="Close" className="absolute top-4 right-4 text-[var(--text-faint)] hover:text-[var(--text)] transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="w-16 h-16 rounded-md bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h3 className="text-2xl font-heading font-bold text-center text-[var(--text)] mb-3">Connection error</h3>
        <p className="text-[var(--muted)] text-center text-[15px] leading-relaxed mb-8">
          {error || "Failed to connect. Some content could not be loaded."}
        </p>
        <button onClick={() => setOpen(false)} className="w-full bg-accent hover:bg-[var(--text)] text-white hover:text-[var(--app-bg)] font-body font-semibold py-4 rounded-md transition-colors duration-300 text-sm">
          Dismiss
        </button>
      </div>
    </div>
  );
}
