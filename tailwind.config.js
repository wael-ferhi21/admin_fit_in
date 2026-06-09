/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          green:  '#10b981',
          purple: '#8b5cf6',
          blue:   '#3b82f6',
          teal:   '#14b8a6',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted:   '#f8f9fc',
          border:  '#e8eaf0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:   '0 1px 4px 0 rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 20px 0 rgba(0,0,0,0.10)',
        glow:   '0 0 20px rgba(16,185,129,0.25)',
        'glow-purple': '0 0 20px rgba(139,92,246,0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backgroundImage: {
        'gradient-ai':    'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
        'gradient-green': 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
        'gradient-warm':  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
      },
    },
  },
  plugins: [],
};
