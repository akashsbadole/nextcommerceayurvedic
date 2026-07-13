import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F7F1DE',
        bgalt: '#EFE6C8',
        paper: '#FFFDF6',
        ink: '#241D14',
        inksoft: '#5B5240',
        green: {
          DEFAULT: '#2F4A3C',
          dark: '#1C2C23',
          tint: '#DCE6DA',
        },
        gold: {
          DEFAULT: '#C68A2E',
          tint: '#F1DFB4',
        },
        red: '#A6402F',
        sand: '#D9C7A3',
        line: '#E1D6B8',
        vata: '#6C6094',
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-work-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        s: '6px',
        m: '14px',
        l: '28px',
      },
      boxShadow: {
        vedika: '0 12px 30px -14px rgba(28,44,35,.28)',
      },
      maxWidth: {
        container: '1240px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
