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
        brand: {
          50: '#fff1f4',
          100: '#ffe4e8',
          200: '#fecdd6',
          300: '#fda4b4',
          400: '#fb718d',
          500: '#f43f6e',
          600: '#e31b64', // Interspace Magenta
          700: '#be124d',
          800: '#9f1244',
          900: '#83143c',
          950: '#4c051f',
        },
        sunset: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f37023', // Interspace Sunset Tangerine
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        interspace: {
          magenta: '#e31b64',
          orange: '#f37023',
          red: '#e31b23',
          charcoal: '#23272a',
          dark: '#0b0f17',
        },
        copper: {
          50: '#fdf7f3',
          100: '#faeee5',
          200: '#f4dbc9',
          300: '#ebc0a3',
          400: '#df9e73',
          500: '#d97d43',
          600: '#ca6331',
          700: '#a84c26',
          800: '#863e24',
          900: '#6d3521',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
