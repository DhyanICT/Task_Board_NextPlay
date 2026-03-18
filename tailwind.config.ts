import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 18px 60px rgba(15, 23, 42, 0.35)",
      },
      backgroundImage: {
        "hero-radial": "radial-gradient(circle at top, rgba(34,211,238,0.18), transparent 35%), radial-gradient(circle at right, rgba(168,85,247,0.16), transparent 28%)",
      },
    },
  },
  plugins: [],
};

export default config;
