import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0E14",
        ink2: "#11151F",
        team: {
          red: "#FF4655",
          redDim: "#3A1620",
          blue: "#3FC1FF",
          blueDim: "#122733",
        },
        gold: "#FFC94D",
        mist: "#AEB6C4",
        paper: "#F5F7FA",
      },
      fontFamily: {
        display: ["var(--font-cairo)", "sans-serif"],
        body: ["var(--font-tajawal)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 60px -12px var(--tw-shadow-color)",
      },
      keyframes: {
        pulseRing: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.03)" },
        },
        floatUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseRing: "pulseRing 2.4s ease-in-out infinite",
        floatUp: "floatUp 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
