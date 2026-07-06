import type { Config } from 'tailwindcss';
import twailindcssanimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class',"dark"],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './ui/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5dae3',
          300: '#b0b9c9',
          400: '#8593aa',
          500: '#677591',
          600: '#525e78',
          700: '#434c61',
          800: '#3a4251',
          900: '#0b1020',
          950: '#070a16',
        },
        brand: {
          50: '#eefdf6',
          100: '#d6fbeb',
          200: '#aff5d6',
          300: '#76ebbb',
          400: '#3bd896',
          500: '#16bd76',
          600: '#0a9a60',
          700: '#087a4f',
          800: '#0a6240',
          900: '#0a5035',
          950: '#012e1d',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(22,189,118,0.18), 0 18px 60px -12px rgba(22,189,118,0.35)',
        soft: '0 1px 2px rgba(11,16,32,0.04), 0 12px 32px -12px rgba(11,16,32,0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'bar-grow': {
          '0%': { transform: 'scaleY(0.15)' },
          '100%': { transform: 'scaleY(1)' },
        },
        accordion: {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4,0,0.2,1) infinite',
        marquee: 'marquee 32s linear infinite',
        'bar-grow': 'bar-grow 0.9s ease-out both',
        accordion: 'accordion 0.2s ease-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [twailindcssanimate],
};

export default config;
