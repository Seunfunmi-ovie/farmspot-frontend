/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['"Work Sans"', 'sans-serif']
      },
      colors: {
        bg: '#F6F3EA',
        ink: '#1C2A20',
        inksoft: '#55645A',
        field: { DEFAULT: '#2F4B3C', deep: '#1F3329' },
        gold: '#C9A332',
        soil: '#8A5A33',
        sage: '#E8EBDF',
        line: '#DAD4C2',
        err: { DEFAULT: '#9C3B2E', bg: '#F7E9E6' },
        ok: { bg: '#EAF0E6' }
      }
    }
  },
  plugins: []
}
