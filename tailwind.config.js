/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          deep: '#020308',
          DEFAULT: '#050612',
          surface: 'rgba(10, 20, 50, 0.45)',
          hover: 'rgba(16, 28, 68, 0.65)',
        },
        cyan: {
          electric: '#4fd8ff',
          subtle: 'rgba(79, 216, 255, 0.12)',
        },
        pink: {
          accent: '#ff5aa5',
        },
        ice: '#e8fbff',
        blue: {
          electric: '#2979ff',
          deep: '#0a3cff',
        },
        text: {
          primary: '#f1f7ff',
          secondary: '#b8cae4',
          dim: '#8ba1c2',
        },
      },
      fontFamily: {
        display: ['Unbounded', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 30px rgba(79, 216, 255, 0.45)',
        'cyan-glow-sm': '0 0 15px rgba(79, 216, 255, 0.3)',
        'pink-glow': '0 0 30px rgba(255, 90, 165, 0.5)',
        'pink-glow-sm': '0 0 15px rgba(255, 90, 165, 0.35)',
        glass: '0 10px 30px rgba(0, 0, 0, 0.5)',
        'glass-hover': '0 18px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(79, 216, 255, 0.2)',
        'glass-tier-1': '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(79, 216, 255, 0.15)',
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

