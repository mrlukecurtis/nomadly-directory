import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas:          'var(--color-canvas)',
        cream:           'var(--color-cream)',
        ink:             'var(--color-ink)',
        'body-muted':    'var(--color-body-muted)',
        slate:           'var(--color-slate)',
        hairline:        'var(--color-hairline)',
        'border-light':  'var(--color-border-light)',
        'card-border':   'var(--color-card-border)',
        forest:          'var(--color-forest)',
        'forest-dark':   'var(--color-forest-dark)',
        coral:           'var(--color-coral)',
        'coral-soft':    'var(--color-coral-soft)',
        gold:            'var(--color-gold)',
        'gold-soft':     'var(--color-gold-soft)',
        error:           'var(--color-error)',
        focus:           'var(--color-focus)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body:    ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'nm-xs':   '4px',
        'nm-sm':   '8px',
        'nm-md':   '16px',
        'nm-lg':   '22px',
        'nm-xl':   '30px',
        'nm-pill': '32px',
      },
      boxShadow: {
        'float-soft': '0 4px 16px rgba(43, 42, 38, 0.08)',
        'float':      '0 12px 32px rgba(43, 42, 38, 0.14)',
      },
    },
  },
  plugins: [],
}

export default config
