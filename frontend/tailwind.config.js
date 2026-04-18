/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#1e293b',
        accent: '#06b6d4',
        glass: {
          light: 'rgba(255, 255, 255, 0.25)',
          dark: 'rgba(0, 0, 0, 0.25)',
        },
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(10px)',
        'blur-md': 'blur(12px)',
        'blur-lg': 'blur(16px)',
      },
      boxShadow: {
        'glass-sm': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        'glass-lg': '0 8px 32px 0 rgba(31, 38, 135, 0.3)',
        'glow': '0 0 30px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 50px rgba(59, 130, 246, 0.5)',
      },
      backgroundImage: {
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-glass-dark': 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)',
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
        'gradient-accent': 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5', boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '50%': { opacity: '1', boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out',
        shimmer: 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

