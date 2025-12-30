/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",   // 👈 REQUIRED
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#F4F8F3",
        foreground: "#1B5E20",
        primary: "#4CAF50",
        "primary-foreground": "#ffffff",
        border: "#E0E0E0",
        muted: "#558B2F",
      },
    },
  },
  plugins: [],
};
