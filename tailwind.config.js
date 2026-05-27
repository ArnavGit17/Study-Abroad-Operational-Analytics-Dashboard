/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172033',
        muted: '#657084',
        line: '#dfe6ef',
        canvas: '#f5f7fb',
        teal: '#13a89e',
        coral: '#f9735b',
        amber: '#f2aa3b',
        ocean: '#3178c6',
        grape: '#7467ef',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(23, 32, 51, 0.08)',
        glow: '0 20px 60px rgba(49, 120, 198, 0.16)',
      },
      animation: {
        'fade-up': 'fadeUp 0.55s ease-out both',
        'soft-pulse': 'softPulse 2.4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        softPulse: {
          '0%, 100%': { opacity: 0.72 },
          '50%': { opacity: 1 },
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
