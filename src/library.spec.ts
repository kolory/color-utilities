import {ColorUtilities} from './library'
import {hexColor} from './types'
import {ColorTypes} from './color-types-enum'

const basicHexColor: hexColor = '#FFA500'

// Library allows using colors without the initial # in some cases (not in validation, though).
const strictlyValidHexColors = [
  basicHexColor,
  '#aaa',
  '#123',
  '#AAAAAA'
]

const invalidHexColors = [
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

const validRgbColors = [
  'rgb(1,1,1)',
  'rgb(123, 255, 0)',
  ' rgb  (   12,    12,1   )   ',
  'RGB(255, 0, 0)'
]

const invalidRgbColors = [
  'Xrgb(0, 1, 2)',
  'rgb(256, 255, 255)', // 256, out of range
  'rgb(001, 02, 3)', // Invalid number
  'rgb(A, 02, 3)', // Invalid number
  'rgb(,,)',
  'rgb(1,2,)'
]

const expectedExportedColors = [['white', '#FFFFFF'], ['black', '#000000']]

describe('Color utilities', () => {
  let colorUtil: ColorUtilities

  beforeEach(() => {
    colorUtil = new ColorUtilities()
  })

  describe('Color definitions', () => {
    it('should expose valid colors', () => {
      expectedExportedColors.forEach(([color, hexValue]) => {
        expect(ColorUtilities.color[color]).toEqual(hexValue)
        expect(colorUtil.isValidHexColor(ColorUtilities.color[color])).toBeTruthy()
      })
    })
  })

  describe('Utilities', () => {
    it('should calculate colors luminance', () => {
      expect(colorUtil.calculateLuminanceOf('#FFFFFF')).toBe(1)
      expect(colorUtil.calculateLuminanceOf('#000000')).toBe(0)
      expect(colorUtil.calculateLuminanceOf('#FFA500')).toBeCloseTo(0.48170267036309633)
      expect(colorUtil.calculateLuminanceOf('#00FF00')).toBeCloseTo(0.7152)
      expect(colorUtil.calculateLuminanceOf('#AF3512')).toBeCloseTo(0.11703838572298138)

      expect(colorUtil.calculateLuminanceOf('rgb(255, 255, 255)')).toBe(1)
      expect(colorUtil.calculateLuminanceOf('rgb(0, 0, 0)')).toBe(0)
      expect(colorUtil.calculateLuminanceOf('rgb(255, 165, 0)')).toBeCloseTo(0.48170267036309633)
      expect(colorUtil.calculateLuminanceOf('rgb(0, 255, 0)')).toBeCloseTo(0.7152)
      expect(colorUtil.calculateLuminanceOf('rgb(175, 53, 18)')).toBeCloseTo(0.11703838572298138)
    })

    it('should calculate the contrast ratio of two colors', () => {
      expect(colorUtil.calculateContrastRatio('#FFFFFF', '#000000')).toBe(21 / 1)
      expect(colorUtil.calculateContrastRatio('#000000', '#FFFFFF')).toBe(21 / 1) // Order doesn't matter.
      expect(colorUtil.calculateContrastRatio('#000000', '#000000')).toBe(1 / 1)
      expect(Math.round(colorUtil.calculateContrastRatio('#FFA500', '#000000'))).toBe(11 / 1)
      expect(Math.round(colorUtil.calculateContrastRatio('#FFA500', '#FFFFFF'))).toBe(2 / 1)

      expect(colorUtil.calculateContrastRatio('rgb(255, 255, 255)', 'rgb(0, 0, 0)')).toBe(21 / 1)
      expect(colorUtil.calculateContrastRatio('rgb(0, 0, 0)', 'rgb(0, 0, 0)')).toBe(1 / 1)
      expect(Math.round(colorUtil.calculateContrastRatio('rgb(255, 165, 0)', 'rgb(0, 0, 0)'))).toBe(11 / 1)
      expect(Math.round(colorUtil.calculateContrastRatio('rgb(255, 165, 0)', 'rgb(255, 255, 255)'))).toBe(2 / 1)
    })

    it('should properly resolve color type', () => {
      strictlyValidHexColors.forEach(color => expect(colorUtil.resolveColorType(color)).toBe(ColorTypes.hex))
      validRgbColors.forEach(color => expect(colorUtil.resolveColorType(color)).toBe(ColorTypes.rgb))
      invalidRgbColors.forEach(color => expect(colorUtil.resolveColorType(color)).toBe(ColorTypes.invalidType))
      invalidHexColors.forEach(color => expect(colorUtil.resolveColorType(color)).toBe(ColorTypes.invalidType))
    })
  })

  describe('Colors parsing', () => {
    it('should parse all valid colors', () => {
      expect(colorUtil.parseColor('#FFF')).toEqual([255, 255, 255])
      expect(colorUtil.parseColor('#FFFFFF')).toEqual([255, 255, 255])
      expect(colorUtil.parseColor('#000000')).toEqual([0, 0, 0])
      expect(colorUtil.parseColor('#ffa500')).toEqual([255, 165, 0])
      expect(colorUtil.parseColor(basicHexColor)).toEqual([255, 165, 0])
      expect(colorUtil.parseColor('rgb(0, 0, 0)')).toEqual([0, 0, 0])
      expect(colorUtil.parseColor('rgb(1, 2, 100)')).toEqual([1, 2, 100])
      expect(colorUtil.parseColor('rgb(255, 255, 255)')).toEqual([255, 255, 255])
    })

    it('should transform hex colors into RGB values array', () => {
      expect(colorUtil.parseHexColor('#FFF')).toEqual([255, 255, 255])
      expect(colorUtil.parseHexColor('#FFFFFF')).toEqual([255, 255, 255])
      expect(colorUtil.parseHexColor('#000000')).toEqual([0, 0, 0])
      expect(colorUtil.parseHexColor('#ffa500')).toEqual([255, 165, 0])
      expect(colorUtil.parseHexColor(basicHexColor)).toEqual([255, 165, 0])
    })

    it('should transform RGB color into RGB values array', () => {
      expect(colorUtil.parseRgbColor('rgb(0, 0, 0)')).toEqual([0, 0, 0])
      expect(colorUtil.parseRgbColor('rgb(1, 2, 100)')).toEqual([1, 2, 100])
      expect(colorUtil.parseRgbColor('rgb(255, 255, 255)')).toEqual([255, 255, 255])
    })

    it('should allow using shorthand hex colors', () => {
      expect(colorUtil.parseHexColor('#FFF')).toEqual(colorUtil.parseHexColor('#FFFFFF'))
    })

    it('should treat capitalized and lower case HEX colors in the same way', () => {
      expect(colorUtil.parseHexColor('#ffffff')).toEqual(colorUtil.parseHexColor('#FFFFFF'))
    })

    it('should inform about failed parsing', () => {
      [...invalidHexColors, ...invalidRgbColors].forEach(color =>
        expect(() => colorUtil.parseColor(color)).toThrowError(TypeError))

      invalidHexColors.forEach(invalidColor =>
        expect(() => colorUtil.parseHexColor(invalidColor)).toThrowError(TypeError))

      invalidRgbColors.forEach(invalidColor =>
        expect(() => colorUtil.parseRgbColor(invalidColor)).toThrowError(TypeError))
    })
  })

  describe('Color validation', () => {
    it('should validate hex colors', () => {
      strictlyValidHexColors.forEach(color => expect(colorUtil.isValidHexColor(color)).toBeTruthy())
      invalidHexColors.forEach(color => expect(colorUtil.isValidHexColor(color)).toBeFalsy())
      expect(colorUtil.isValidHexColor('FFFFFF')).toBeFalsy()
      expect(colorUtil.isValidHexColor(undefined)).toBeFalsy()
      expect(colorUtil.isValidHexColor('')).toBeFalsy()
    })

    it('should validate RGB colors', () => {
      validRgbColors.forEach(color => expect(colorUtil.isValidRgbColor(color)).toBeTruthy())
      invalidRgbColors.forEach(color => expect(colorUtil.isValidRgbColor(color)).toBeFalsy())
      expect(colorUtil.isValidRgbColor(undefined)).toBeFalsy()
      expect(colorUtil.isValidRgbColor('')).toBeFalsy()
    })
  })

  describe('Colors analyze', () => {
    it('should allow splitting the hex color into its parts', () => {
      expect(colorUtil.splitHexColor(basicHexColor)).toEqual(['FF', 'A5', '00'])
      expect(colorUtil.splitHexColor('#ffa500')).toEqual(['FF', 'A5', '00']) // Note the uppercases characters.
    })

    it('should allow splitting the rgb color into its parts', () => {
      expect(colorUtil.splitRgbColor('rgb(0, 1, 3')).toEqual([0, 1, 3])
      expect(colorUtil.splitRgbColor('rgb(255, 255, 255')).toEqual([255, 255, 255])
    })
  })

  describe('Colors normalization', () => {
    it('should normalize the shorthand hex colors', () => {
      expect(colorUtil.normalizeHexColor('#aaa')).toBe('#AAAAAA')
      expect(colorUtil.normalizeHexColor('#aaaaaa')).toBe('#AAAAAA')
      expect(colorUtil.normalizeHexColor('#fa5')).toBe('#FFAA55')
      expect(colorUtil.normalizeHexColor(basicHexColor)).toBe(basicHexColor)
    })

    it('should handle semi-valid color (without #)', () => {
      expect(colorUtil.normalizeHexColor('FFFFFF')).toBe('#FFFFFF')
      expect(colorUtil.normalizeHexColor('fff')).toBe('#FFFFFF')
      expect(colorUtil.normalizeHexColor('123')).toBe('#112233')
    })

    it('should not handle invalid hex colors', () => {
      invalidHexColors.forEach(invalidColor =>
        expect(() => colorUtil.normalizeHexColor(invalidColor)).toThrowError(TypeError))
    })

    it('should normalize RGB colors with strange spacing or uppercase letters', () => {
      expect(colorUtil.normalizeRgbColor('rgb(1, 2, 3)')).toBe('rgb(1, 2, 3)') // No normalization in this case.
      expect(colorUtil.normalizeRgbColor('   rgb    (  1,    2,3  )   ')).toBe('rgb(1, 2, 3)')
      expect(colorUtil.normalizeRgbColor('RGB(100, 100, 100)')).toBe('rgb(100, 100, 100)')
      expect(colorUtil.normalizeRgbColor('rgb(1,2,3)')).toBe('rgb(1, 2, 3)')
    })

    it('should not handle invalid RGB colors', () => {
      invalidRgbColors.forEach(invalidColor =>
        expect(() => colorUtil.normalizeRgbColor(invalidColor)).toThrowError(TypeError))
    })
  })
})
