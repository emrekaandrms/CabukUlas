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
        primary: {
          50: "#e8f0fe",
          100: "#d2e3fc",
          200: "#aecbfa",
          300: "#8ab4f8",
          400: "#669df6",
          500: "#1a73e8",
          600: "#1967d2",
          700: "#185abc",
          800: "#1a56a0",
          900: "#174ea6",
        },
        fastest: {
          DEFAULT: "#0d9488",
          light: "#ccfbf1",
        },
      },
    },
  },
  plugins: [],
};
