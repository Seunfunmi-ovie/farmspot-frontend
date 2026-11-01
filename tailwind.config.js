/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      },
      colors: {
        bg: '#F2F6F3',
        paper: '#FFFFFF',
        ink: '#14231A',
        inksoft: '#667A6E',
        field: { DEFAULT: '#0E8A41', deep: '#096B32', soft: '#E1F3E7' },
        gold: '#F2A93B',
        wheat: '#CDEBD8',
        soil: '#8A6A3F',
        sage: '#E8F0EA',
        line: '#E1E9E3',
        err: { DEFAULT: '#D0453B', bg: '#FDECEA' },
        ok: { bg: '#E1F3E7' }
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,35,26,0.05), 0 8px 24px rgba(20,35,26,0.06)'
      }
    }
  },
  plugins: []
}