import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17211f",
        leaf: "#1f6f5b",
        coral: "#d65a3a",
        skywash: "#eaf6f8",
        paper: "#fbfffe"
      },
      boxShadow: {
        soft: "0 18px 40px rgba(23, 33, 31, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
