/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary dark backgrounds
        dark: {
          950: '#020805',
          900: '#050D0A',
          800: '#0A1F14',
          700: '#0F2D1C',
          600: '#163D26',
          500: '#1E5233',
        },
        // Neon green accent
        neon: {
          50:  '#f0fff4',
          100: '#dcffe8',
          200: '#b3ffd0',
          300: '#7affa8',
          400: '#39ff7a',
          500: '#00FF87',
          600: '#00d96e',
          700: '#00b058',
          800: '#008a45',
          900: '#006e38',
        },
        // Cyan accent
        cyan: {
          400: '#22d3ee',
          500: '#00D4FF',
          600: '#0ea5e9',
        },
        // Leaf green
        leaf: {
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        // Earth tones
        earth: {
          300: '#d6b896',
          400: '#c4956a',
          500: '#a0714f',
          600: '#7c5230',
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        inter: ['Inter', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #020805 0%, #0A1F14 50%, #050D0A 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(15,45,28,0.8) 0%, rgba(10,31,20,0.9) 100%)',
        'neon-gradient': 'linear-gradient(135deg, #00FF87 0%, #00D4FF 100%)',
        'glow-gradient': 'radial-gradient(ellipse at center, rgba(0,255,135,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 255, 135, 0.4), 0 0 40px rgba(0, 255, 135, 0.2)',
        'neon-sm': '0 0 10px rgba(0, 255, 135, 0.3)',
        'neon-lg': '0 0 40px rgba(0, 255, 135, 0.5), 0 0 80px rgba(0, 255, 135, 0.2)',
        'cyan': '0 0 20px rgba(0, 212, 255, 0.4)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(0, 255, 135, 0.1)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 255, 135, 0.15)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 135, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 135, 0.8), 0 0 60px rgba(0, 255, 135, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glow: {
          '0%': { textShadow: '0 0 10px rgba(0, 255, 135, 0.5)' },
          '100%': { textShadow: '0 0 20px rgba(0, 255, 135, 1), 0 0 40px rgba(0, 255, 135, 0.5)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
