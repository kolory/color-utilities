import {hexColor} from './types'

export const basicHexColor: hexColor = '#FFA500'

// Library allows using colors without the initial # in some cases (not in validation, though).
export const strictlyValidHexColors = [
  basicHexColor,
  '#aaa',
  '#123',
  '#AAAAAA'
]

export const invalidHexColors = [
  'invalid',

  // Too many or too few characters
  '#4',
  '#A3',
  '#AB23',
  '#FFAA',
  '#AB233',
  '#aaaaaaa',

  '#GFAA500' // No 'G' in the range
]

export const validRgbColors = [
  'rgb(1,1,1)',
  'rgb(123, 255, 0)',
  ' rgb  (   12,    12,1   )   ',
  'RGB(255, 0, 0)'
]

export const invalidRgbColors = [
  'Xrgb(0, 1, 2)',
  'rgb(256, 255, 255)', // 256, out of range
  'rgb(001, 02, 3)', // Invalid number
  'rgb(A, 02, 3)', // Invalid number
  'rgb(,,)',
  'rgb(1,2,)'
]

export const validHslColors = [
  'hsl(0, 0%, 0%)',
  'hsl(360, 0%, 0%)',
  '  hsl  (   100,   50%,1%  )   ',
  'HSL(235, 13%, 99%)',
  'hsl(360, 100%, 100%)'
]

export const invalidHslColors = [
  'xhsl(100, 0%, 10%)',
  'hsl(400, 10%, 20%)',
  'hsl(100, 10, 20)',
  'hsl(200, 200%, 20%)',
  'hsl(200, 10%, 200%)',
  'hsl(,,)'
]

export const invalidColors = [...invalidHslColors, ...invalidRgbColors, ...invalidHexColors]
