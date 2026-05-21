/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        mir: {
          black: "#050505",
          dark: "#161616",
          gold: "#C8A24D",
          silver: "#D9D9DD",
          muted: "#8F8F95"
        }
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "Avenir", "Helvetica Neue", "Arial", "sans-serif"]
      },
      boxShadow: {
        gold: "0 24px 70px rgba(200,162,77,0.14)",
        soft: "0 18px 60px rgba(0,0,0,0.28)"
      }
    }
  },
  plugins: []
};
