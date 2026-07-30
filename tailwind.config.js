/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['Outfit', 'Inter', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        bg:      'var(--bg)',
        'bg-2':  'var(--bg-2)',
        'bg-3':  'var(--bg-3)',
        accent:  'var(--accent-1)',
        'accent-2': 'var(--accent-2)',
        'accent-3': 'var(--accent-3)',
      },
      animation: {
        'float':      'float 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow':  'spin-slow 8s linear infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}
