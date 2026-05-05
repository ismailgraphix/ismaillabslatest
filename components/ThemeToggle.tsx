"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Avoid hydration mismatch (theme is undefined on server)
  if (!mounted) return null;

  const resolved = theme === "system" ? systemTheme : theme;
  const label =
    theme === "system"
      ? `System (${resolved === "dark" ? "Dark" : "Light"})`
      : theme === "dark"
        ? "Dark"
        : "Light";

  return (
    <div className="relative">
      <select
        aria-label="Theme"
        value={theme ?? "system"}
        onChange={(e) => setTheme(e.target.value)}
        className="hidden md:inline-flex bg-[var(--surface)]/70 backdrop-blur-sm border-2 border-[var(--border)] text-[var(--text)] font-body font-semibold text-[12px] px-3 py-2 hover:border-[#4353FF] transition-colors"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>

      {/* Compact button for mobile (cycle) */}
      <button
        type="button"
        className="md:hidden w-11 h-11 rounded-full border-2 border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-sm hover:border-[#4353FF] transition-all duration-300 flex items-center justify-center text-[var(--text)]"
        onClick={() => {
          const order = ["system", "light", "dark"] as const;
          const idx = Math.max(0, order.indexOf((theme as any) ?? "system"));
          setTheme(order[(idx + 1) % order.length]);
        }}
        aria-label={`Theme: ${label}`}
        title={`Theme: ${label}`}
      >
        <span className="font-heading font-black text-[12px] leading-none">
          {resolved === "dark" ? "D" : "L"}
        </span>
      </button>
    </div>
  );
}

