/** @type {import('tailwindcss').Config} */
/* const colors = require('tailwindcss/colors') */

module.exports = {
  content: ['./public/*.html', './src/*.js'],
  theme: {
    extend: {
      gridColumn: {
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-17': 'span 17 / span 17',
        'span-18': 'span 18 / span 18',
        'span-19': 'span 19 / span 19',
        'span-20': 'span 20 / span 20',
        'span-21': 'span 21 / span 21',
        'span-22': 'span 22 / span 22',
        'span-23': 'span 23 / span 23',
        'span-24': 'span 24 / span 24',
      },
      gridRow: {
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-17': 'span 17 / span 17',
        'span-18': 'span 18 / span 18',
        'span-19': 'span 19 / span 19',
        'span-20': 'span 20 / span 20',
        'span-21': 'span 21 / span 21',
        'span-22': 'span 22 / span 22',
        'span-23': 'span 23 / span 23',
        'span-24': 'span 24 / span 24',
      },
      gridColumnStart: {
        '13': '13',
        '14': '14',
        '15': '15',
        '16': '16',
        '17': '17',
        '18': '18',
        '19': '19',
        '20': '20',
        '21': '21',
        '22': '22',
        '23': '23',
        '24': '24',
      },
      gridRowStart: {
        '13': '13',
        '14': '14',
        '15': '15',
        '16': '16',
        '17': '17',
        '18': '18',
        '19': '19',
        '20': '20',
        '21': '21',
        '22': '22',
        '23': '23',
        '24': '24',
      },
      gridColumnEnd: {
        '13': '13',
        '14': '14',
        '15': '15',
        '16': '16',
        '17': '17',
        '18': '18',
        '19': '19',
        '20': '20',
        '21': '21',
        '22': '22',
        '23': '23',
        '24': '24',
      },
      gridRowEnd: {
        '13': '13',
        '14': '14',
        '15': '15',
        '16': '16',
        '17': '17',
        '18': '18',
        '19': '19',
        '20': '20',
        '21': '21',
        '22': '22',
        '23': '23',
        '24': '24',
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
        '17': 'repeat(17, minmax(0, 1fr))',
        '18': 'repeat(18, minmax(0, 1fr))',
        '19': 'repeat(19, minmax(0, 1fr))',
        '20': 'repeat(20, minmax(0, 1fr))',
        '21': 'repeat(21, minmax(0, 1fr))',
        '22': 'repeat(22, minmax(0, 1fr))',
        '23': 'repeat(23, minmax(0, 1fr))',
        '24': 'repeat(24, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
        '17': 'repeat(17, minmax(0, 1fr))',
        '18': 'repeat(18, minmax(0, 1fr))',
        '19': 'repeat(19, minmax(0, 1fr))',
        '20': 'repeat(20, minmax(0, 1fr))',
        '21': 'repeat(21, minmax(0, 1fr))',
        '22': 'repeat(22, minmax(0, 1fr))',
        '23': 'repeat(23, minmax(0, 1fr))',
        '24': 'repeat(24, minmax(0, 1fr))',
      },
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
}
