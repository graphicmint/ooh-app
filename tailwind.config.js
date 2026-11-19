/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Theme Palette
        surface: {
          DEFAULT: '#191C24',
          light: '#222631',
          border: '#2C2E33',
          canvas: '#000000',
        },
        brand: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#e84c96',
          500: '#c91d74',
          600: '#AF1763', // Primary Magenta Accent
          700: '#8f1250',
          800: '#750f41',
          900: '#5c0c33',
          950: '#38051e',
        },
        // Supporting Palette
        support: {
          blue: '#0D6EFD',
          green: '#198754',
          cyan: '#0DCAF0',
          red: '#AB2E3C',
          yellow: '#FFC107',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
