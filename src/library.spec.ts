import {ColorUtilities} from './library'
import {ColorTypes} from './color-types-enum'
import {
  invalidHslColors, invalidRgbColors, invalidHexColors, strictlyValidHexColors,
  validRgbColors, validHslColors, basicHexColor
} from "./test-colors";


const expectedExportedColors = [['white', '#FFFFFF'], ['black', '#000000']]

describe('Color utilities', () => {
  let colorUtil: ColorUtilities

  beforeEach(() => {
    colorUtil = new ColorUtilities()
  })

  describe('Basic features', () => {
    it('should allow creating an instance using the `new` operator and as from a factory', () => {
      expect(new ColorUtilities()).toBeDefined()
      expect(ColorUtilities.create() instanceof ColorUtilities).toBeTruthy()
    })
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
    it('should calculate the color\'s luminance', () => {
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

      expect(colorUtil.calculateLuminanceOf('hsl(0, 0%, 0%)')).toBe(0)
      expect(colorUtil.calculateLuminanceOf('hsl(0, 100%, 100%)')).toBe(1)
      expect(colorUtil.calculateLuminanceOf('hsl(39, 100%, 50%)')).toBeCloseTo(0.48170267036309633)
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

      expect(colorUtil.calculateContrastRatio('hsl(0, 100%, 100%)', 'hsl(0, 0%, 0%)')).toBe(21 / 1)
      expect(colorUtil.calculateContrastRatio('hsl(0, 0%, 0%)', 'hsl(0, 0%, 0%)')).toBe(1 / 1)
      expect(Math.round(colorUtil.calculateContrastRatio('hsl(39, 100%, 50%)', 'hsl(0, 0%, 0%)'))).toBe(11 / 1)
    })

    it('should allow mixing color types when calculating their contrast ratio', () => {
      expect(colorUtil.calculateContrastRatio('hsl(0, 100%, 100%)', 'rgb(0, 0, 0)')).toBe(21 / 1)
      expect(colorUtil.calculateContrastRatio('rgb(255, 255, 255)', '#000000')).toBe(21 / 1)
    })

    it('should properly resolve color type', () => {
      strictlyValidHexColors.forEach(color => expect(colorUtil.resolveColorType(color)).toBe(ColorTypes.hex))
      validRgbColors.forEach(color => expect(colorUtil.resolveColorType(color)).toBe(ColorTypes.rgb))
      validHslColors.forEach(color => expect(colorUtil.resolveColorType(color)).toBe(ColorTypes.hsl))
      invalidRgbColors.forEach(color => expect(colorUtil.resolveColorType(color)).toBe(ColorTypes.invalidType))
      invalidHexColors.forEach(color => expect(colorUtil.resolveColorType(color)).toBe(ColorTypes.invalidType))
      invalidHslColors.forEach(color => expect(colorUtil.resolveColorType(color)).toBe(ColorTypes.invalidType))
    })
  })

  describe('Colors converters', () => {
    it('should allow converting all colors formats to other formats', () => {
      expect(colorUtil.convert('rgb(255, 255, 255)', ColorTypes.hex)).toBe('#FFFFFF')
      expect(colorUtil.convert('rgb(255, 165, 0)', ColorTypes.hex)).toBe('#FFA500')
      expect(colorUtil.convert('rgb(0, 0, 0)', ColorTypes.hex)).toBe('#000000')
      expect(colorUtil.convert('hsl(253, 98%, 47%)', ColorTypes.hex)).toBe('#3502ED')
      expect(colorUtil.convert('#FFFFFF', ColorTypes.rgb)).toBe('rgb(255, 255, 255)')
      expect(colorUtil.convert('#fff', ColorTypes.rgb)).toBe('rgb(255, 255, 255)')
      expect(colorUtil.convert('#FFA500', ColorTypes.rgb)).toBe('rgb(255, 165, 0)')
      expect(colorUtil.convert('hsl(39, 100%, 50%)', ColorTypes.rgb)).toBe('rgb(255, 166, 0)')

      // HSL conversion requires a special attention.
      expect(colorUtil.convert('#FFFFFF', ColorTypes.hsl)).toBe('hsl(0, 100%, 100%)')
      expect(colorUtil.convert('#000000', ColorTypes.hsl)).toBe('hsl(0, 0%, 0%)')
      expect(colorUtil.convert('#999', ColorTypes.hsl)).toBe('hsl(0, 0%, 60%)')
      expect(colorUtil.convert('#AF90F9', ColorTypes.hsl)).toBe('hsl(258, 90%, 77%)')
      expect(colorUtil.convert('#F00234', ColorTypes.hsl)).toBe('hsl(347, 98%, 47%)')
      expect(colorUtil.convert('#F03402', ColorTypes.hsl)).toBe('hsl(13, 98%, 47%)')
      expect(colorUtil.convert('#34F002', ColorTypes.hsl)).toBe('hsl(107, 98%, 47%)')
      expect(colorUtil.convert('#02F034', ColorTypes.hsl)).toBe('hsl(133, 98%, 47%)')
      expect(colorUtil.convert('#0234F0', ColorTypes.hsl)).toBe('hsl(227, 98%, 47%)')
      expect(colorUtil.convert('#3402F0', ColorTypes.hsl)).toBe('hsl(253, 98%, 47%)')
      expect(colorUtil.convert('rgb(86, 175, 50)', ColorTypes.hsl)).toBe('hsl(103, 56%, 44%)')
      expect(colorUtil.convert('rgb(255, 165, 0)', ColorTypes.hsl)).toBe('hsl(39, 100%, 50%)')
    })

    it('should throw when trying to convert an invalid color or to an invalid type', () => {
      invalidHslColors.forEach(color => expect(() => colorUtil.convert(color, ColorTypes.rgb)).toThrowError(TypeError))
      invalidRgbColors.forEach(color => expect(() => colorUtil.convert(color, ColorTypes.hex)).toThrowError(TypeError))
      invalidHexColors.forEach(color => expect(() => colorUtil.convert(color, ColorTypes.hsl)).toThrowError(TypeError))
      expect(() => colorUtil.convert('rgb(255, 255, 255)', ColorTypes.invalidType)).toThrowError(TypeError)
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
      expect(colorUtil.parseColor('hsl(360, 100%, 100%)')).toEqual([255, 255, 255])
      expect(colorUtil.parseColor('hsl(0, 100%, 50%)')).toEqual([255, 0, 0])
      expect(colorUtil.parseColor('hsl(120, 100%, 50%)')).toEqual([0, 255, 0])
      expect(colorUtil.parseColor('hsl(150, 75%, 50%)')).toEqual([32, 223, 128])
      expect(colorUtil.parseColor('hsl(190, 15%, 70%)')).toEqual([167, 186, 190])
      expect(colorUtil.parseColor('hsl(242, 63%, 54%)')).toEqual([69, 64, 212])
    })

    it('should transform hex colors into RGB values array', () => {
      expect(colorUtil.parseHexColor('#FFF')).toEqual([255, 255, 255])
      expect(colorUtil.parseHexColor('#FFFFFF')).toEqual([255, 255, 255])
      expect(colorUtil.parseHexColor('#000000')).toEqual([0, 0, 0])
      expect(colorUtil.parseHexColor('#ffa500')).toEqual([255, 165, 0])
      expect(colorUtil.parseHexColor(basicHexColor)).toEqual([255, 165, 0])
    })

    it('should transform RGB colors into RGB values array', () => {
      expect(colorUtil.parseRgbColor('rgb(0, 0, 0)')).toEqual([0, 0, 0])
      expect(colorUtil.parseRgbColor('rgb(1, 2, 100)')).toEqual([1, 2, 100])
      expect(colorUtil.parseRgbColor('rgb(255, 255, 255)')).toEqual([255, 255, 255])
    })

    it('should transform HSL colors into RGB values array', () => {
      expect(colorUtil.parseHslColor('hsl(360, 100%, 100%)')).toEqual([255, 255, 255])
      expect(colorUtil.parseHslColor('hsl(0, 100%, 50%)')).toEqual([255, 0, 0])
      expect(colorUtil.parseHslColor('hsl(120, 100%, 50%)')).toEqual([0, 255, 0])
      expect(colorUtil.parseHslColor('hsl(150, 75%, 50%)')).toEqual([32, 223, 128])
      expect(colorUtil.parseHslColor('hsl(190, 15%, 70%)')).toEqual([167, 186, 190])
      expect(colorUtil.parseHslColor('hsl(242, 63%, 54%)')).toEqual([69, 64, 212])
      expect(colorUtil.parseHslColor('hsl(39, 100%, 50%)')).toEqual([255, 166, 0])
    })

    it('should allow using shorthand hex colors', () => {
      expect(colorUtil.parseHexColor('#FFF')).toEqual(colorUtil.parseHexColor('#FFFFFF'))
    })

    it('should treat capitalized and lower case HEX colors in the same way', () => {
      expect(colorUtil.parseHexColor('#ffffff')).toEqual(colorUtil.parseHexColor('#FFFFFF'))
    })

    it('should inform about failed parsing', () => {
      [...invalidHexColors, ...invalidRgbColors, ...invalidHslColors].forEach(color =>
        expect(() => colorUtil.parseColor(color)).toThrowError(TypeError))

      invalidHexColors.forEach(invalidColor =>
        expect(() => colorUtil.parseHexColor(invalidColor)).toThrowError(TypeError))

      invalidRgbColors.forEach(invalidColor =>
        expect(() => colorUtil.parseRgbColor(invalidColor)).toThrowError(TypeError))

      invalidHslColors.forEach(invalidColor =>
        expect(() => colorUtil.parseRgbColor(invalidColor)).toThrowError(TypeError))
    })
  })

  describe('Color validation', () => {
    it('should validate all colors', () => {
      strictlyValidHexColors.forEach(color => expect(colorUtil.isValidColor(color)).toBeTruthy())
      invalidHexColors.forEach(color => expect(colorUtil.isValidColor(color)).toBeFalsy())
      expect(colorUtil.isValidColor('FFFFFF')).toBeFalsy()
      validRgbColors.forEach(color => expect(colorUtil.isValidColor(color)).toBeTruthy())
      invalidRgbColors.forEach(color => expect(colorUtil.isValidColor(color)).toBeFalsy())
      validHslColors.forEach(color => expect(colorUtil.isValidHslColor(color)).toBeTruthy())
      invalidHslColors.forEach(color => expect(colorUtil.isValidHslColor(color)).toBeFalsy())
      expect(colorUtil.isValidColor(undefined)).toBeFalsy()
      expect(colorUtil.isValidColor('')).toBeFalsy()
    })

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

    it('should validate HSL colors', () => {
      validHslColors.forEach(color => expect(colorUtil.isValidHslColor(color)).toBeTruthy())
      invalidHslColors.forEach(color => expect(colorUtil.isValidHslColor(color)).toBeFalsy())
      expect(colorUtil.isValidHslColor(undefined)).toBeFalsy()
      expect(colorUtil.isValidHslColor('')).toBeFalsy()
    })
  })

  describe('Colors analyze', () => {
    it('should allow splitting the hex colors into its parts', () => {
      expect(colorUtil.splitHexColor(basicHexColor)).toEqual(['FF', 'A5', '00'])
      expect(colorUtil.splitHexColor('#ffa500')).toEqual(['FF', 'A5', '00']) // Note the uppercases characters.
    })

    it('should allow splitting the RGB colors into its parts', () => {
      expect(colorUtil.splitRgbColor('rgb(0, 1, 3')).toEqual([0, 1, 3])
      expect(colorUtil.splitRgbColor('rgb(255, 255, 255')).toEqual([255, 255, 255])
    })

    it('should allow splitting the HSL colors into its parts', () => {
      expect(colorUtil.splitHslColor('hsl(360, 100%, 100%)')).toEqual([255, 255, 255])
      expect(colorUtil.splitHslColor('hsl(0, 100%, 50%)')).toEqual([255, 0, 0])
      expect(colorUtil.splitHslColor('hsl(120, 100%, 50%)')).toEqual([0, 255, 0])
      expect(colorUtil.splitHslColor('hsl(150, 75%, 50%)')).toEqual([32, 223, 128])
      expect(colorUtil.splitHslColor('hsl(190, 15%, 70%)')).toEqual([167, 186, 190])
      expect(colorUtil.splitHslColor('hsl(242, 63%, 54%)')).toEqual([69, 64, 212])
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

    it('should normalize HSL colors', () => {
      expect(colorUtil.normalizeHslColor('hsl(0,0%,0%)')).toBe('hsl(0, 0%, 0%)')
      expect(colorUtil.normalizeHslColor('hsl(100,10%,0%)')).toBe('hsl(100, 10%, 0%)')
      expect(colorUtil.normalizeHslColor('HSL(200, 40%, 90%)')).toBe('hsl(200, 40%, 90%)')
      expect(colorUtil.normalizeHslColor('  hsl(  360,   10%,0%   )  ')).toBe('hsl(360, 10%, 0%)')
    })

    it('should not handle invalid HSL colors', () => {
      invalidHslColors.forEach(invalidColor =>
        expect(() => colorUtil.normalizeHslColor(invalidColor)).toThrowError(TypeError))
    })
  })
})
