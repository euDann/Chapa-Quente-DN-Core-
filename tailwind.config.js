/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 'Inter' é excelente para interfaces técnicas e limpas
        sans: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        // Garantindo que o peso máximo funcione bem
        'black': '900',
        'extra-black': '1000',
      },
      letterSpacing: {
        'ultra-widest': '0.5em',
      }
    },
  },
  plugins: [],
}