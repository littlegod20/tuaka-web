import type { Config } from 'tailwindcss'

const config: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#E1F5EE',
          100: '#9FE1CB',
          400: '#25A572',
          600: '#1A6B4A',
          900: '#04342C',
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
