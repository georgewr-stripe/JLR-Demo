/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./sections/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {

    extend: {
      colors: {
        green: '#0B6836',
        darkGreen: '#0F291D',
        grey: '#EDEDEE',
        darkGrey: '#989EA5'
      },
    },
  },
  plugins: [],
}
