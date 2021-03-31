module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: {
          350: '#B7BCC5',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
