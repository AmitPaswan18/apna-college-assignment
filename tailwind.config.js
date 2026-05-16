/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8b5cf6",
        "primary-hover": "#7c3aed",
        secondary: "#06b6d4",
        accent: "#f43f5e",
        easy: "#10b981",
        medium: "#f59e0b",
        hard: "#ef4444",
        background: "#0a0a0c",
      },
      backgroundImage: {
        "glass-gradient":
          "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",
      },
    },
  },
  plugins: [],
};
