/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0D111C",
        surface: "#151B29",
        surfaceRaised: "#1A2233",
        ink: "#EAEDF6",
        inkSoft: "#8E9AC0",
        inkFaint: "#525E7D",
        line: "#242C42",
        acheter: "#5B8CFF",
        acheterSoft: "#152442",
        vendre: "#2DD4C6",
        vendreSoft: "#0F2E2C",
        assistant: "#9C8CFF",
      },
    },
  },
  plugins: [],
};
