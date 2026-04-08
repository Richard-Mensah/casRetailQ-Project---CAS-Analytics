/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#E1F5EE',
          100: '#9FE1CB',
          200: '#5DCAA5',
          500: '#1D9E75',
          600: '#0F6E56',
          700: '#085041',
          900: '#0F4C35',
        },
        amber: {
          50:  '#FAEEDA',
          100: '#FAC775',
          500: '#BA7517',
          700: '#854F0B',
        },
        danger: {
          50:  '#FAECE7',
          500: '#D85A30',
          700: '#993C1D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
