/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ea580c', // Orange 600
        secondary: '#64748b', // Slate 500
        background: '#f8fafc', // Slate 50
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scan: {
          '0%, 100%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-1px) rotate(-1deg)' },
          '75%': { transform: 'translateX(1px) rotate(1deg)' },
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scan': 'scan 2s linear infinite',
        'wiggle': 'wiggle 2s ease-in-out infinite',
        'shake': 'shake 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}