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
  const isDark = resolved === "dark";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      className="group w-11 h-11 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md hover:border-[#4353FF] hover:shadow-[0_8px_30px_rgba(67,83,255,0.22)] transition-all duration-300 flex items-center justify-center"
    >
      <span className="sr-only">{isDark ? "Dark mode" : "Light mode"}</span>

      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[var(--text)] transition-transform duration-300 group-hover:rotate-6">
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3c-.13.43-.21.89-.21 1.37A7.63 7.63 0 0 0 18.63 12c.48 0 .94-.08 1.37-.21Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[var(--text)] transition-transform duration-300 group-hover:-rotate-6">
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.9 5.1l-1.5 1.5M6.6 17.4l-1.5 1.5M18.9 18.9l-1.5-1.5M6.6 6.6L5.1 5.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
