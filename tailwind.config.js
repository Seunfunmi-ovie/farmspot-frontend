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
        bg: '#F5F1E6',
        paper: '#FFFEFA',
        ink: '#262A20',
        inksoft: '#625F52',
        field: { DEFAULT: '#3D4A2C', deep: '#2B351F' },
        gold: '#A8864B',
        wheat: '#DCC48C',
        soil: '#7B5638',
        sage: '#E9E8D8',
        line: '#DED7C2',
        err: { DEFAULT: '#9B3E2C', bg: '#F5E6DF' },
        ok: { bg: '#E7EBD8' }
      },
      boxShadow: {
        card: '0 1px 2px rgba(43,53,31,0.06), 0 6px 18px rgba(43,53,31,0.05)'
      }
    }
  },
  plugins: []
}