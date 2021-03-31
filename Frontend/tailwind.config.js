module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      theme: {
        // container: {
        //   center: true,
        //   padding: '2rem',
        // },
        // fontFamily: {
        //   body: ['Gamja Flower', 'cursive'],
        // },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
