import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // The three families are loaded with next/font in app/layout.tsx, which
      // sets these CSS variables on <html>.
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      // Brand colours. The values are written once, in app/globals.css.
      //   bg-accent, border-accent/30 ...  the accent as a shape or fill (same in both themes)
      //   text-accent-text                 accent-coloured text at body size (lighter in the dark theme)
      //   bg-ink, from-ink ...             ink, for surfaces that stay dark in both themes
      colors: {
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--accent-rgb) / <alpha-value>)",
          text: "var(--accent-text)",
        },
      },
    },
  },
  plugins: [
      require("@tailwindcss/typography"),
  ],
};
export default config;
