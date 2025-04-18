/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1ff',
          100: '#cce4ff',
          200: '#99c8ff',
          300: '#66adff',
          400: '#3391ff',
          500: '#0070f3',
          600: '#005ac2',
          700: '#004392',
          800: '#002d61',
          900: '#001631',
        },
      },
    },
  },
  plugins: [],
}
