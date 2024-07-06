/** @type {import('tailwindcss').Config} */
/* const colors = require('tailwindcss/colors') */

module.exports = {
  content: ['./public/*.html', './src/*.js'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': { DEFAULT: '#fbfff1', 100: '#476300', 200: '#8ec600', 300: '#c3ff2a', 400: '#dfff8d', 500: '#fbfff1', 600: '#fcfff3', 700: '#fcfff6', 800: '#fdfff9', 900: '#fefffc' },
      'purple': { DEFAULT: '#b19cd9', 100: '#201436', 200: '#40296c', 300: '#613da2', 400: '#8765c5', 500: '#b19cd9', 600: '#c0afe1', 700: '#d0c3e8', 800: '#e0d7f0', 900: '#efebf7' },
      'blue': { DEFAULT: '#048ba8', 100: '#011c22', 200: '#023844', 300: '#035365', 400: '#036f87', 500: '#048ba8', 600: '#06c1eb', 700: '#3ad7fa', 800: '#7ce4fc', 900: '#bdf2fd' },
      'darkBlue': { DEFAULT: '#141b41', 100: '#04050d', 200: '#080b1b', 300: '#0c1028', 400: '#101635', 500: '#141b41', 600: '#283683', 700: '#3d51c3', 800: '#7d8bd7', 900: '#bec5eb' },
      'green': { DEFAULT: '#5a716a', 100: '#121715', 200: '#242d2b', 300: '#364440', 400: '#495b55', 500: '#5a716a', 600: '#77928a', 700: '#99ada7', 800: '#bbc9c4', 900: '#dde4e2' },
      'gray': { DEFAULT: '#0c0c0c', 100: '#030303', 200: '#050505', 300: '#080808', 400: '#0a0a0a', 500: '#0c0c0c', 600: '#3d3d3d', 700: '#6e6e6e', 800: '#9e9e9e', 900: '#cfcfcf' },
    },
  },
  plugins: [],
}

