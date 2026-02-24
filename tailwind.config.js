/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jagota: {
          red: '#C0392B',
          darkred: '#922B21',
          blue: '#1565C0',
          lightblue: '#1E88E5',
          gray: '#F5F5F5',
          darkgray: '#424242',
        }
      },
      fontFamily: {
        sans: ['Sarabun', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
