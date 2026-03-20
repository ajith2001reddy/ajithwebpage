/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#F5F5F7',
          100: '#EFEFF2',
          200: '#E5E5EA',
          300: '#D1D1D6',
          400: '#B3B3B8',
          500: '#8E8E93',
          600: '#767680',
          700: '#5A5A5F',
          800: '#424245',
          900: '#1D1D1F',
        },
        blue: {
          600: '#0071E3',
          700: '#0077ED',
          500: '#0A84FF',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
};
