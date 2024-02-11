/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.css',
    './src/**/*.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
