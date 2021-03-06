import {Color} from './color'
import {basicColor} from './types'
import {strictlyValidHexColors, validRgbColors, invalidColors} from './test-colors'
import {ColorUtilities} from './library'

const baseColor: basicColor = '#FFFFFF'

describe('Color object', () => {
  const utils = new ColorUtilities()

  describe('Color definitions', () => {
    it('should expose valid colors', () => {
      expect(Color.black.hex).toBe('#000000')
      expect(Color.white.hex).toBe('#FFFFFF')
      expect(Color.red.hex).toBe('#FF0000')
      expect(Color.green.hex).toBe('#00FF00')
      expect(Color.blue.hex).toBe('#0000FF')
    })
  })

  describe('Color creation', () => {
    it('should allow creating an instance using the `new` operator and as from a factory', () => {
      expect(new Color()).toBeDefined()
      expect(Color.create() instanceof Color).toBeTruthy()
    })

    it('should allow creating a Color object from raw RGB values', () => {
      expect(new Color(255, 255, 255).hex).toBe('#FFFFFF')
      expect(new Color(255, 165, 0).hex).toBe('#FFA500')
      expect(Color.create(255, 255, 255).hex).toBe('#FFFFFF')
      expect(Color.create(255, 165, 0).hex).toBe('#FFA500')
    })

    it('should allow using a valid color during creation', () => {
      expect(new Color(baseColor).hex).toBe(baseColor)
      expect(Color.create(baseColor).hex).toBe(baseColor)
      strictlyValidHexColors.forEach(color => expect(Color.create(color).hex).toBe(utils.normalizeHexColor(color)))
      validRgbColors.forEach(color => expect(Color.create(color).rgb).toBe(utils.normalizeRgbColor(color)))

      // Since the HSL conversion doesn't really work in two ways, just make sure the basic scenario works.
      expect(Color.create('hsl(0, 0%, 0%)').hsl).toBe('hsl(0, 0%, 0%)')
    })

    it('should return the Color object itself when using it to instantiate another one', () => {
      const color1 = new Color('#000000')
      const color2 = new Color(color1)
      expect(color2.hex).toBe(color1.hex)
      expect(color2).toBe(color1)
    })

    it('should defaults to white when no color was provided during initialization', () => {
      expect(new Color().hex).toBe('#FFFFFF')
    })

    it('should not allow using invalid colors during creation', () => {
      invalidColors.forEach(color => expect(() => new Color(color)).toThrowError(TypeError))
      expect(() => new Color(-1, 0, 0)).toThrow()
      expect(() => new Color(100, 100, 300)).toThrow()
      expect(() => new Color(100, 100, 300)).toThrow()
      expect(() => new Color(100, NaN, 100)).toThrow()
    })
  })

  describe('Basic actions', () => {
    it('should allow accessing the value in hex, RGB and HSL formats', () => {
      const color = new Color('#000000')
      expect(color.hex).toBe('#000000')
      expect(color.rgb).toBe('rgb(0, 0, 0)')
      expect(color.hsl).toBe('hsl(0, 0%, 0%)')
    })

    it('should expose it\'s RGB values', () => {
      const color = new Color('#FFA500')
      expect(color.R).toBe(255)
      expect(color.G).toBe(165)
      expect(color.B).toBe(0)
      expect(color.values).toEqual([255, 165, 0])
    })

    it('should allow setting a new value', () => {
      let color = new Color('#FFFFFF')
      expect(color.set('#000000').hex).toBe('#000000')
      expect(color.set(new Color('#FFFFFF')).hex).toBe('#FFFFFF')
    })

    it('should create a new Color object when setting a new value (immutability)', () => {
      let color = new Color()
      expect(color.set('#FFA500')).not.toBe(color)
      expect(color.set('#FFA500') instanceof Color).toBeTruthy()
    })

    it('should throw when trying to set an invalid value', () => {
      let color = new Color()
      invalidColors.forEach(invalidColor => expect(() => color.set(invalidColor)).toThrowError(TypeError))
    })
  })

  describe('Interoperability', () => {
    it('should present itself as a hex color when used in a string context', () => {
      /* tslint:disable:restrict-plus-operands */
      expect(new Color('#000') + '').toBe('#000000')
      expect(new Color('rgb(255, 255, 255)') + '').toBe('#FFFFFF')
      expect(new Color('hsl(0, 0%, 100%)') + '').toBe('#FFFFFF')
      expect(`Hello! I'm an orange with a color ${new Color('rgb(255, 165, 0)')}!`)
        .toBe(`Hello! I'm an orange with a color #FFA500!`)
      /* tslint:enable */
    })

    it('should compare two different colors or Color objects by their color value', () => {
      expect(new Color('#FFFFFF').equals(new Color('#FFFFFF'))).toBeTruthy()
      expect(new Color('#FFFFFF').equals(new Color('#000000'))).toBeFalsy()
      expect(new Color('#FFFFFF').equals('#FFFFFF')).toBeTruthy()
      expect(new Color('#FFFFFF').equals('#000000')).toBeFalsy()
      expect(new Color('#FFFFFF').equals('invalid')).toBeFalsy()
    })

    it('should have a way of deciding if another object is a Color object', () => {
      expect(Color.isColor(new Color('#FFFFFF'))).toBeTruthy()
      expect(Color.isColor('#FFFFFF')).toBeFalsy()
    })
  })

  describe('Calculations', () => {
    it('should expose it\'s luminance', () => {
      expect(new Color('#FFFFFF').luminance).toBe(1)
      expect(new Color('#000000').luminance).toBe(0)
      expect(new Color('#FFA500').luminance).toBeCloseTo(0.48170267036309633)
      expect(new Color('#00FF00').luminance).toBeCloseTo(0.7152)
      expect(new Color('#AF3512').luminance).toBeCloseTo(0.11703838572298138)
    })

    it('should calculate contrast to other color (either a string or another Color)', () => {
      expect(new Color('#FFFFFF').calculateContrastTo('#000000')).toBe(21 / 1)
      expect(new Color('#000000').calculateContrastTo('#FFFFFF')).toBe(21 / 1)
      expect(new Color('hsl(0, 0%, 0%)').calculateContrastTo('rgb(0, 0, 0)')).toBe(1 / 1)
      expect(Math.round(new Color('#FFA500').calculateContrastTo('#000000'))).toBe(11 / 1)
      expect(Math.round(new Color('#FFA500').calculateContrastTo('#FFFFFF'))).toBe(2 / 1)

      expect(new Color('#FFFFFF').calculateContrastTo(new Color('#000000'))).toBe(21 / 1)
      expect(new Color('#000000').calculateContrastTo(new Color('#FFFFFF'))).toBe(21 / 1)
      expect(new Color('#000000').calculateContrastTo(new Color('#000000'))).toBe(1 / 1)
      expect(Math.round(new Color('#FFA500').calculateContrastTo(new Color('#000000')))).toBe(11 / 1)
      expect(Math.round(new Color('#FFA500').calculateContrastTo(new Color('#FFFFFF')))).toBe(2 / 1)
    })
  })
})
