/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        appColor:"#192028",
        buttonColor:"#212A31",
      }
    },
  },
  darkMode: "class",
  plugins: [],
};
