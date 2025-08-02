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
          100: "#f4f2f2",
          200: '#eae3e4',
          300: "#dbd0d0",
          500: "#7f6b6c",
          700: "#51373d",
          800: "#381f23"
        },
        red: {
          200: "#f99395",
          400: "#fc7173",
          500: "#ef3b3e"
        },
        "dark-bg": "#141010",
        "dark-secondary": "#211d1d",
        "dark-tertiary": "#3f3a3a",
        "red-primary": "#ff0228",
        "stroke-dark": "#352d2d",
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
