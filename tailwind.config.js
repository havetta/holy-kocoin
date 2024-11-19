/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/**/*.css",
    "./src/css/common.css",
    "./index.html",
    "./public/**/*.{vue,js,ts,jsx,tsx,css,html}",
    "./src/**/*.{vue,js,ts,jsx,tsx,css,html}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
