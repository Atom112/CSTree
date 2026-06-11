/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tree: {
          line: '#94a3b8',
          node: '#3b82f6',
          'node-hover': '#2563eb',
          'node-active': '#1d4ed8',
          related: '#8b5cf6',
          prerequisite: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"Source Han Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
};
