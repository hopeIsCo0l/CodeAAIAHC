import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        foreground: '#e2e8f0',
        muted: '#1e293b',
        accent: '#38bdf8',
      },
    },
  },
  plugins: [],
} satisfies Config;
