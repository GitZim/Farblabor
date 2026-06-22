/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0e1726',
          soft: '#3a4658',
          faint: '#7a8597',
        },
        surface: {
          DEFAULT: '#ffffff',
          sunken: '#f4f6f9',
          line: '#e4e8ee',
        },
        brand: {
          DEFAULT: '#2a7ca5',
          deep: '#173f5f',
          soft: '#7fb8d4',
        },
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
      },
    },
  },
  plugins: [],
}
