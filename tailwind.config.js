/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-fast': 'bounce 0.5s infinite',
        'spin-fast': 'spin 1s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-fast': 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'rainbow': 'rainbow 2s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.6s ease-out',
        'flip': 'flip 2s ease-in-out infinite',
        'jiggle': 'jiggle 0.5s ease-in-out infinite',
        'attention': 'attention 2s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #ff0000' },
          '100%': { boxShadow: '0 0 20px #ff0000, 0 0 30px #ff0000' },
        },
        rainbow: {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0%)' },
          '10%': { transform: 'translateX(-10px) rotate(-5deg)' },
          '20%': { transform: 'translateX(10px) rotate(5deg)' },
          '30%': { transform: 'translateX(-10px) rotate(-5deg)' },
          '40%': { transform: 'translateX(10px) rotate(5deg)' },
          '50%': { transform: 'translateX(-5px) rotate(-2deg)' },
          '60%': { transform: 'translateX(5px) rotate(2deg)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        jiggle: {
          '0%': { transform: 'rotate(-3deg) scale(1)' },
          '50%': { transform: 'rotate(3deg) scale(1.1)' },
          '100%': { transform: 'rotate(-3deg) scale(1)' },
        },
        attention: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
      colors: {
        // Modern ADHD color palette
        'adhd-primary': '#6366f1',    // Modern indigo
        'adhd-secondary': '#8b5cf6',  // Purple
        'adhd-accent': '#ec4899',     // Pink
        'adhd-success': '#10b981',    // Emerald
        'adhd-warning': '#f59e0b',    // Amber
        'adhd-focus': '#3b82f6',      // Blue

        // Glassmorphism colors
        'glass-light': 'rgba(255, 255, 255, 0.1)',
        'glass-medium': 'rgba(255, 255, 255, 0.2)',
        'glass-dark': 'rgba(0, 0, 0, 0.1)',

        // Gradient colors
        'gradient-start': '#667eea',
        'gradient-middle': '#764ba2',
        'gradient-end': '#f093fb',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'display': ['Lexend', 'Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'monospace'],
        'comic': ['Comic Neue', 'Comic Sans MS', 'cursive'],
        'marker': ['Caveat', 'Permanent Marker', 'cursive'],
      },
    },
  },
  plugins: [],
}
