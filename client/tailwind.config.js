/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F6FA',
        surface: '#FFFFFF',
        'surface-raised': '#FBFBFD',
        border: '#E2E4ED',
        'border-strong': '#CBCEDC',
        ink: {
          DEFAULT: '#12151C',
          muted: '#6B7280',
          faint: '#9AA0AE',
        },
        primary: {
          DEFAULT: '#3642C4',
          hover: '#2C3699',
          soft: '#EEF0FC',
        },
        accent: {
          DEFAULT: '#E2A63B',
          soft: '#FBF1DD',
        },
        success: {
          DEFAULT: '#159873',
          soft: '#E3F5EE',
        },
        warning: {
          DEFAULT: '#D98A2B',
          soft: '#FBF0DF',
        },
        critical: {
          DEFAULT: '#D0483F',
          soft: '#FBEAE8',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        lg: '14px',
        xl: '20px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(18, 21, 28, 0.04), 0 1px 12px rgba(18, 21, 28, 0.04)',
        'card-hover': '0 4px 10px rgba(18, 21, 28, 0.06), 0 2px 20px rgba(18, 21, 28, 0.06)',
      },
      keyframes: {
        'grow-bar': {
          from: { width: '0%' },
          to: { width: 'var(--bar-value)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'grow-bar': 'grow-bar 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up': 'fade-up 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
}
