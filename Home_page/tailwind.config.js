module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        'bird-pattern': "url('./images/profile.jpeg')",
        // 'footer-texture': "url('/img/footer-texture.png')",
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
