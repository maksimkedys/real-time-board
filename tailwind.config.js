/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        board: {
          bg: 'var(--board-bg)',
          column: 'var(--board-column-bg)',
          card: 'var(--board-card-bg)',
          border: 'var(--board-card-border)',
          accent: 'var(--board-accent)',
          'accent-soft': 'var(--board-accent-soft)',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2684ff',
          600: '#1d6fe0',
          700: '#1554b5',
          800: '#0f3c82',
        },
      },
    },
  },
  plugins: [],
};
