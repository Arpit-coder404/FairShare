/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: '#101114',
        midnight: '#17191F',
        elevated: {
          DEFAULT: '#20232B',
          surface: '#20232B',
          hover: '#262A34',
          border: '#2E333E',
          card: '#1B1E25',
        },
        warmWhite: '#F4F3EE',
        mutedText: '#9296A2',
        lime: {
          DEFAULT: '#C9FF5C',
          electric: '#C9FF5C',
          dim: '#A6DB3D',
          glow: 'rgba(201, 255, 92, 0.15)',
        },
        coral: {
          DEFAULT: '#FF786E',
          bright: '#FF786E',
          dim: '#E05D53',
          glow: 'rgba(255, 120, 110, 0.15)',
        },
        softBlue: {
          DEFAULT: '#8EAFFF',
          dim: '#7395EB',
          glow: 'rgba(142, 175, 255, 0.15)',
        },
        violet: {
          DEFAULT: '#B8A0FF',
          dim: '#9F83EB',
          glow: 'rgba(184, 160, 255, 0.15)',
        },
      },
      fontFamily: {
        display: ['Syne', 'Cabinet Grotesk', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-lime': '0 0 24px -4px rgba(201, 255, 92, 0.25)',
        'glow-coral': '0 0 24px -4px rgba(255, 120, 110, 0.25)',
        'glow-softBlue': '0 0 24px -4px rgba(142, 175, 255, 0.25)',
        'glow-violet': '0 0 24px -4px rgba(184, 160, 255, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orbit-spin': 'spin 60s linear infinite',
      },
    },
  },
  plugins: [],
}

