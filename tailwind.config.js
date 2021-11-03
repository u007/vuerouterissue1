const { defineConfig } = require('windicss/helpers');
const daisyUI = require('daisyui');

exports.default = defineConfig({
  mode: 'jit',
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ...require('daisyui/colors'),
        // teal: {
        //   100: '#096',
        // },
      },
    },
  },
  plugins: [
    daisyUI
  ],
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
})
