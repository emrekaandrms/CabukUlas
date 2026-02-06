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
          light: "#FFF0EB",
          50: "#FFF7F3",
        },
        surface: "#FFFFFF",
        bg: "#F5F5F0",
        warm: {
          50: "#FAFAF7",
          100: "#F5F5F0",
          200: "#E8E8E3",
          300: "#D4D4CF",
          400: "#AEAEB2",
          500: "#8E8E93",
          600: "#636366",
          700: "#48484A",
          800: "#2C2C2E",
          900: "#1A1A1A",
        },
      },
    },
  },
  plugins: [],
};
