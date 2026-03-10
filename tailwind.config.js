/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#FF6B35",
          light: "#FFF3EE",
          dark: "#E55A2B",
        },
        surface: "#FFFFFF",
        bg: "#F8F8F6",
        warm: {
          50: "#F8F8F6",
          100: "#F2F2EF",
          200: "#E5E5E0",
          300: "#D4D4CF",
          400: "#C7C7CC",
          500: "#8E8E93",
          600: "#636366",
          700: "#48484A",
          800: "#2C2C2E",
          900: "#1C1C1E",
        },
      },
    },
  },
  plugins: [],
};
