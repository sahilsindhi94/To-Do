/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#101828',
        cloud: '#f7f8fb',
        coral: '#ff6b6b',
        mint: '#2dd4bf',
        honey: '#f59e0b',
      },
      boxShadow: {
        glass: '0 24px 80px rgba(16, 24, 40, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.45)',
        glow: '0 18px 50px rgba(45, 212, 191, 0.18)',
        lift: '0 18px 44px rgba(16, 24, 40, 0.12)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite',
      },
    },
  },
  plugins: [],
}
