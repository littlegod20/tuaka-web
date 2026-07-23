import type { Config } from 'tailwindcss'

const config: Config = {
  content: [],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#E1F5EE',
          100: '#9FE1CB',
          200: '#76CDAD',
          300: '#4EB990',
          400: '#25A572',
          500: '#20885E',
          600: '#1A6B4A',
          700: '#135940',
          800: '#0B4636',
          900: '#04342C',
          950: '#021A16',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        logo: ['Abres', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
