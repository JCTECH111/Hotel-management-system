/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'hotel-secondary': {
          100: '#ECF3F3', // Lightest shade
          200: '#D9E6E6', // Slightly darker
          300: '#C6D9D9', // Even darker
          400: '#B3CCCC', // Darker
          500: '#A0BFBF', // Base color
          600: '#8DA6A6', // Darker
          700: '#7A8C8C', // Even darker
          800: '#677373', // Darker
          900: '#545959', // Darkest shade
        },
      },
    },
  },
  plugins: [], // No need to add tailwindcss or autoprefixer here
};
