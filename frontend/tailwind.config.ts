import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#08080f',
        surface: '#0f0f1a',
        'surface-raised': '#16162a',
        border: '#1e1e3a',
        'text-primary': '#e8e8f0',
        'text-muted': '#6b6b8a',
        'text-mono': '#a0a0c0',
        indigo: {
          DEFAULT: '#6d5aff',
          hover: '#9d7bff',
        },
        croo: {
          DEFAULT: '#6DDB52',
          dim: '#4db83a',
        },
        verdict: {
          safe: '#6DDB52',
          caution: '#f5a623',
          avoid: '#ff3d5a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glow-indigo': '0 0 24px -4px rgba(109, 90, 255, 0.4)',
        'glow-safe': '0 0 24px -2px rgba(109, 219, 82, 0.45)',
        'glow-caution': '0 0 24px -2px rgba(245, 166, 35, 0.45)',
        'glow-avoid': '0 0 24px -2px rgba(255, 61, 90, 0.45)',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-dot': 'pulse 1.4s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
