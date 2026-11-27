/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          deep: '#0c0f1d',
          DEFAULT: '#121629',
          surface: 'rgba(24, 30, 56, 0.58)',
          hover: 'rgba(34, 42, 76, 0.78)',
        },
        cyan: {
          electric: '#ffb300',
          subtle: 'rgba(255, 179, 0, 0.14)',
        },
        pink: {
          accent: '#ff6b00',
        },
        ice: '#fff8e7',
        blue: {
          electric: '#e2e8f0',
          deep: '#78350f',
        },
        text: {
          primary: '#fafafa',
          secondary: '#d4d4d8',
          dim: '#a1a1aa',
        },
      },
      fontFamily: {
        display: ['Unbounded', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 30px rgba(255, 179, 0, 0.45)',
        'cyan-glow-sm': '0 0 15px rgba(255, 179, 0, 0.3)',
        'pink-glow': '0 0 30px rgba(255, 107, 0, 0.5)',
        'pink-glow-sm': '0 0 15px rgba(255, 107, 0, 0.35)',
        glass: '0 10px 30px rgba(0, 0, 0, 0.55)',
        'glass-hover': '0 18px 40px rgba(0, 0, 0, 0.75), 0 0 25px rgba(255, 179, 0, 0.22)',
        'glass-tier-1': '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(255, 179, 0, 0.16)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};

