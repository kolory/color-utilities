import {ColorUtilities} from './index'

const basicHexColor = '#FFA500'

const validHexColors = [
  basicHexColor,
  '#aaa',
  '#123',
  '#AAAAAA'
]

const invalidHexColors = [
  'invalid',
  '10AA40', // No #

  // Too many or too few characters
  '#4',
  '#A3',
  '#AB23',
  '#FFAA',
  '#AB233',
  '#aaaaaaa',

  '#GFAA500' // No 'G' in the range
]

const expectedExportedColors = [['white', '#FFFFFF'], ['black', '#000000']]

describe('Color utilities', () => {
  let colorUtil: ColorUtilities

  beforeEach(() => {
    colorUtil = new ColorUtilities()
  })

  describe('Dev information', () => {
    it('should expose some information to consumers', () => {
      expect(ColorUtilities.VERSION).toEqual(jasmine.stringMatching(/^(\d+\.){2}\d+$/))
    })
  })

  describe('Color definitons', () => {
    it('should expose valid colors', () => {
      expectedExportedColors.forEach(([color, hexValue]) => expect(ColorUtilities[color]).toEqual(hexValue))
    })
  })

  describe('Utilities', () => {
    it('should calculate colors luminance', () => {
      expect(colorUtil.calculateLuminanceOf('#FFFFFF')).toBe(1)
      expect(colorUtil.calculateLuminanceOf('#000000')).toBe(0)
      expect(colorUtil.calculateLuminanceOf('#FFA500')).toBeCloseTo(0.48170267036309633)
      expect(colorUtil.calculateLuminanceOf('#00FF00')).toBeCloseTo(0.7152)
      expect(colorUtil.calculateLuminanceOf('#AF3512')).toBeCloseTo(0.11703838572298138)
    })
  
  describe('Colors parsing', () => {
    it('should transform hex colors into RGB values array', () => {
      expect(colorUtil.parseHexColor('#FFF')).toEqual([255, 255, 255])
      expect(colorUtil.parseHexColor('#FFFFFF')).toEqual([255, 255, 255])
      expect(colorUtil.parseHexColor('#000000')).toEqual([0, 0, 0])
      expect(colorUtil.parseHexColor('#ffa500')).toEqual([255, 165, 0])
      expect(colorUtil.parseHexColor(basicHexColor)).toEqual([255, 165, 0])
    })

    it('should allow using shorthand hex colors', () => {
      expect(colorUtil.parseHexColor('#FFF')).toEqual(colorUtil.parseHexColor('#FFFFFF'))
    })

    it('should treat capitalized and lower case HEX colors in the same way', () => {
      expect(colorUtil.parseHexColor('#ffffff')).toEqual(colorUtil.parseHexColor('#FFFFFF'))
    })

    it('should inform about failed parsing', () => {
      invalidHexColors.forEach(invalidColor => expect(() => colorUtil.parseHexColor(invalidColor)).toThrowError(TypeError))
    })
  })

  describe('Color validation', () => {
    it('should validate hex colors', () => {
      validHexColors.forEach(color => expect(colorUtil.isValidHexColor(color)).toBeTruthy())
      invalidHexColors.forEach(color => expect(colorUtil.isValidHexColor(color)).toBeFalsy())
      expect(colorUtil.isValidHexColor(null)).toBeFalsy()
      expect(colorUtil.isValidHexColor(undefined)).toBeFalsy()
      expect(colorUtil.isValidHexColor('')).toBeFalsy()
    })
  })

  describe('Colors analyze', () => {
    it('should allow splitting the hex color into its parts', () => {
      expect(colorUtil.splitHexColor(basicHexColor)).toEqual(['FF', 'A5', '00'])
      expect(colorUtil.splitHexColor('#ffa500')).toEqual(['FF', 'A5', '00']) // note the uppercases characters
    })
  })

  describe('Colors normalization', () => {
    it('should normalize the shorthand hex colors', () => {
      expect(colorUtil.normalizeHexColor('#aaa')).toBe('#AAAAAA')
      expect(colorUtil.normalizeHexColor('#aaaaaa')).toBe('#AAAAAA')
      expect(colorUtil.normalizeHexColor('#fa5')).toBe('#FFAA55')
      expect(colorUtil.normalizeHexColor(basicHexColor)).toBe(basicHexColor)
    })

    it('should not handle invalid hex colors', () => {
      invalidHexColors.forEach(invalidColor => expect(() => colorUtil.normalizeHexColor(invalidColor)).toThrowError(TypeError))
    })
  })
})
