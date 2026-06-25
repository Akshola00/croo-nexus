import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0613',
        'bg-deep': '#06030d',
        surface: '#120a24',
        'surface-2': '#19112e',
        'surface-3': '#221638',
        edge: '#2d1f4d',
        'edge-glow': '#4a2f80',
        'text-primary': '#ece6fb',
        'text-dim': '#9a8fc0',
        'text-faint': '#6b5e90',
        purple: {
          deep: '#6d28d9',
          DEFAULT: '#a855f7',
          bright: '#c77dff',
        },
        acid: {
          DEFAULT: '#b4ff2e',
          dim: '#7aab1f',
          deep: '#4d6f12',
        },
        risk: {
          safe: '#b4ff2e',
          caution: '#ffae3a',
          avoid: '#ff2d6b',
        },
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'system-ui', 'sans-serif'],
        sans: ['"Chakra Petch"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 0 20px -2px rgba(168, 85, 247, 0.55), inset 0 0 12px -6px rgba(199, 125, 255, 0.4)',
        'glow-acid': '0 0 22px -2px rgba(180, 255, 46, 0.55), inset 0 0 12px -6px rgba(180, 255, 46, 0.35)',
        'glow-avoid': '0 0 22px -2px rgba(255, 45, 107, 0.6)',
        'glow-caution': '0 0 22px -2px rgba(255, 174, 58, 0.55)',
        'panel': '0 0 0 1px rgba(45, 31, 77, 0.6), 0 20px 60px -20px rgba(0, 0, 0, 0.8)',
      },
      keyframes: {
        'pulse-node': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.85)' },
        },
        'scan-sweep': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(2000%)', opacity: '0' },
        },
        'stream-in': {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)', filter: 'none' },
          '20%': { transform: 'translate(-2px, 1px)', filter: 'hue-rotate(20deg)' },
          '40%': { transform: 'translate(2px, -1px)' },
          '60%': { transform: 'translate(-1px, -1px)', filter: 'hue-rotate(-20deg)' },
          '80%': { transform: 'translate(1px, 1px)' },
        },
        'flow': {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        },
        'sweep-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '45%': { opacity: '1' },
          '50%': { opacity: '0.4' },
          '55%': { opacity: '1' },
        },
      },
      animation: {
        'pulse-node': 'pulse-node 1.3s ease-in-out infinite',
        'scan-sweep': 'scan-sweep 7s linear infinite',
        'stream-in': 'stream-in 0.35s ease-out',
        'glitch': 'glitch 0.35s steps(2) 1',
        'flow': 'flow 0.9s linear infinite',
        'sweep-rotate': 'sweep-rotate 4s linear infinite',
        'flicker': 'flicker 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
