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
      colors: {
        white: '#ffffff',
        gray: {
          100: "#f3f4f6",
          200: '#e5e7eb',
          300: "#d1d5db",
          500: "#6b7280",
          700: "#375151",
          800: "#1f2937"
        },
        red: {
          200: "#fdcb93",
          400: "#fab560",
          500: "#f63b82"
        },
        "dark-bg": "#101214",
        "dark-secondary": "#1d1f21",
        "dark-tertiary": "#3b3d40",
        "red-primary": "#0275ff",
        "stroke-dark": "#2d3135",
      }
    },
    backgroundImage: {
      "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
    }
  },
  plugins: [],
};
export default config;
