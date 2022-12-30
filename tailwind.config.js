/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#212529',
          800: '#343a40',
          700: '#495057',
          600: '#6c757d',
          500: '#adb5bd',
          400: '#ced4da',
          300: '#dee2e6',
          200: '#e9ecef',
          100: '#f8f9fa',
        },
        warning: '#ff6b6b',
        success: '#4AA538',
      },
    },
  },
  plugins: [],
};
