import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-medusa)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        "sc-blue": "#2854a6",
        "sc-blue-dark": "#1e3a8a",
      },
    },
  },
  plugins: [],
};
export default config;
