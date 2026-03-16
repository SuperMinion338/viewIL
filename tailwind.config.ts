import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans Hebrew", "sans-serif"],
      },
      colors: {
        primary: "#2563EB",
        accent: "#F59E0B",
      },
      animation: {
        blob: "blob 7s infinite",
        float: "float 3s ease-in-out infinite",
        wave: "wave 8s linear infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
          "100%": { transform: "translateY(0px)" },
        },
        wave: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    "heatmap-cell-0",
    "heatmap-cell-1",
    "heatmap-cell-2",
    "heatmap-cell-3",
    "heatmap-cell-4",
    "heatmap-cell-5",
    "heatmap-cell-6",
    "heatmap-cell-7",
    "animation-delay-2000",
    "animation-delay-4000",
    "animate-float-delay",
    "animate-float-delay2",
  ],
};
export default config;
