import type { Config } from 'tailwindcss';

// Colors read CSS variables (space separated RGB channels) defined in src/styles/tokens.css.
// Swap brand values in that one file.
const c = (v: string) => `rgb(var(--${v}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ink: c('ink'),
        canvas: c('canvas'),
        surface: c('surface'),
        sunken: c('sunken'),
        brand: c('brand'),
        accent: c('accent'),
        'accent-soft': c('accent-soft'),
        success: c('success'),
        warning: c('warning'),
        danger: c('danger'),
        muted: c('muted'),
        line: c('line'),
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: { xl2: '16px' },
      boxShadow: {
        soft: '0 12px 32px -12px rgb(var(--shadow) / 0.18), 0 2px 6px -2px rgb(var(--shadow) / 0.08)',
      },
      transitionTimingFunction: { calm: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      transitionDuration: { 120: '120ms', 200: '200ms', 320: '320ms', 600: '600ms' },
    },
  },
  plugins: [],
} satisfies Config;
