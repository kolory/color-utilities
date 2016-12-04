import {Color} from "./color";
import {anyColor} from "./types";

const basicColor: anyColor = '#FFFFFF'

describe('Color object', () => {
  let color: Color

  beforeEach(() => {
    color = new Color()
  })

  describe('Color creation', () => {
    it('should allow creating an instance using the `new` operator and as from a factory', () => {
      expect(new Color()).toBeDefined()
      expect(Color.create() instanceof Color).toBeTruthy()
    })

    it('should allow using a valid color during creation', () => {
      expect(new Color(basicColor).hex).toBe(basicColor)
      expect(Color.create(basicColor).hex).toBe(basicColor)

      // TODO Loop on other colors
    })

    it('should allow not using any color during creation and use white instead', () => {

    })

    it('should not allow using invalid colors during creation', () => {

    })
  })

  describe('Basic actions', () => {
    it('should allow accessing the value in hex, RGB and HSL formats', () => {

    })

    it('should expose it\'s RGB values', () => {

    })

    it('should allow setting a new value', () => {

    })

    it('should create a new Color object when setting a new value (immutability)', () => {

    })

    it('should throw when trying to set an invalid value', () => {

    })
  })

  describe('Interoperability', () => {
    it('should present itself as a hex color when used in a string context', () => {
      expect(new Color('#000') + '').toBe('#000000')
      expect(new Color('rgb(255, 255, 255)') + '').toBe('#FFFFFF')
      expect(new Color('hsl(0, 0%, 100%)') + '').toBe('#FFFFFF')
    })
  })
})
