import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Montserrat'", "sans-serif"],
        body: ["'Montserrat'", "sans-serif"],
      },
      colors: {
        accent: "#FF4D00",
        dark: "#0A0A0A",
      },
    },
  },
  plugins: [
      require("@tailwindcss/typography"),
  ],
};
export default config;
