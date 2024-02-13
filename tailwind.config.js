/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.css',
    './src/**/*.html',
    './public/**/*.{vue,js,ts,jsx,tsx,css,html}',
    './src/**/*.{vue,js,ts,jsx,tsx,css,html}'
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
