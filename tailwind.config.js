/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#1a1024',
        sidebar: '#120b1e',
        accent: '#c2185b',
      },
    },
  },
  plugins: [],
};
