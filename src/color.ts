import {anyColor, basicColor, hexColor, rgbColor, hslColor, colorValues} from './types'
import {ColorUtilities} from './library'
import {ColorTypes} from './color-types-enum'

/**
 * Color abstraction to deal with formatting and getting color values.
 *
 * Create the object using the `new` keyword or the Color.create factory method. The color's value is set with
 * a value provided during initialisation. Use either hex, RGB or HSL format, or use another Color object.
 *
 * @example
 * const green = new Color('#00FF00')
 * const red = Color.create('#FF0000')
 */
export class Color {
  /**
   * Exposed access to the utilities service.
   * @type {ColorUtilities}
   */
  static utilities = new ColorUtilities()

  /**
   * Creates the new Color instance from RGB values.
   *
   * @param {number} red value.
   * @param {number} green value.
   * @param {number} blue value.
   */
  static create(red?: number, green?: number, blue?: number): Color

  /**
   * Creates the new Color instance from a color string or another Color object.
   *
   * @param {anyColor} color value to be set.
   */
  static create(color?: anyColor | number): Color

  /**
   * Factory method creating a Color object instance. Provide a valid hex, RGB, HSL color or another Color object.
   * For the insight of how the color is created, refer to the constructor's documentation.
   *
   * @param {anyColor | number} colorOrRed red part of the RGB color or a color.
   * @param {number} green part of the color.
   * @param {number} blue part of the color.
   * @returns {Color} The new Color instance.
   */
  static create(colorOrRed?: anyColor | number, green?: number, blue?: number): Color {
    if (typeof colorOrRed === 'number') {
      return new Color(colorOrRed, green, blue)
    } else {
      return new Color(colorOrRed)
    }
  }

  /**
   * Utility method to check if an object is a Color object.
   *
   * @param {anyColor} color to be checked.
   * @returns {boolean} Is it a Color object?
   */
  static isColor(color?: anyColor): color is Color {
    return color instanceof Color
  }

  /* tslint:disable:completed-docs */
  /* Colors shortcuts. */
  static readonly black = Color.create('#000000')
  static readonly white = Color.create('#FFFFFF')
  static readonly red = Color.create('#FF0000')
  static readonly green = Color.create('#00FF00')
  static readonly blue = Color.create('#0000FF')

  // Current value.
  private color: colorValues
  /* tslint:enable:completed-docs */

  get hex(): hexColor {
    return this.getColor(ColorTypes.hex)
  }

  get rgb(): rgbColor {
    return this.getColor(ColorTypes.rgb)
  }

  get hsl(): hslColor {
    return this.getColor(ColorTypes.hsl)
  }

  get R(): number {
    return this.color[0]
  }

  get G(): number {
    return this.color[1]
  }

  get B(): number {
    return this.color[2]
  }

  get values(): colorValues {
    return this.color.slice() as colorValues
  }

  get luminance(): number {
    return Color.utilities.calculateLuminanceOf(this.hex)
  }

  /**
   * Creates the new Color instance from RGB values.
   *
   * @param {number} red value.
   * @param {number} green value.
   * @param {number} blue value.
   */
  constructor(red?: number, green?: number, blue?: number)

  /**
   * Creates the new Color instance from a color string or another Color object.
   *
   * @param {anyColor} color value to be set.
   */
  constructor(color?: anyColor)

  /**
   * Color object is created from:
   * - a valid hex, RGB or HSL color, returning a Color instance;
   * - another color object, returning the same object;
   * - without any color provided, making the new color white,
   * - RGB values.
   *
   * When another Color is used to create a Color instance, then that object is returned instead. Color class is
   * an abstraction of the color itself, so there's no point in creating a new object. It's impossible to create
   * another "white".
   *
   * @throws TypeError
   * @throws RangeError
   *
   * @param {anyColor | number} colorOrRed red part of the RGB color or a color.
   * @param {number} green part of the color.
   * @param {number} blue part of the color.
   * @returns {Color} The new Color object.
   */
  constructor(colorOrRed?: anyColor | number, green?: number, blue?: number) {
    /* tslint:disable:cyclomatic-complexity */
    if (this.isNumber(colorOrRed)) {
      this.color = this.getColorFromRawValues(colorOrRed, green, blue)
    } else if (!colorOrRed) {
      return Color.white
    } else if (colorOrRed instanceof Color) {
      return colorOrRed
    } else if (!Color.utilities.isValidColor(colorOrRed)) {
      this.throwInvalidColor(colorOrRed)
    } else {
      this.color = Color.utilities.parseColor(colorOrRed)
    }
    /* tslint:enable */
  }

  /**
   * Validates the provided RGB values before returning them back in the colorValues form.
   *
   * @param {number} red value.
   * @param {number} green value.
   * @param {number} blue value.
   * @returns {colorValues} Valid values.
   */
  private getColorFromRawValues(red: number, green?: number, blue?: number): colorValues {
    if (this.areValuesValidRGB([red, green, blue])) {
      return [red, green, blue] as colorValues
    } else {
      throw new Error(`At leas one value from [${red}, ${green}, ${blue}] is not a number or outside of the allowed` +
        `range [0-255] range.`)
    }
  }

  /**
   * Checks if the provided value is a raw number.
   * @param {number | anyColor | undefined | null} value to be checked.
   * @returns {boolean} Is it a raw number?
   */
  private isNumber(value: number | anyColor | undefined | null): value is number {
    return typeof value === 'number'
  }

  /**
   * Checks if the three RGB values are valid numbers and are in the allowed range.
   * @param {(number | undefined | null)[]} values Values to be checked.
   * @returns {number|undefined} Are the values valid?
   */
  private areValuesValidRGB(values: (number | undefined | null)[]): boolean {
    return values.reduce((outcome, value) => outcome && this.isNumber(value) && value >= 0 && value <= 255, true)
  }

  /**
   * Sets a new color value returning a new Color object. Original object is not modified for immutability benefits.
   * The initialisation rules are mostly the same when creating a new object, except the set method doesn't allow
   * not using any value.
   *
   * @throws TypeError
   * @param {anyColor} color to be used when setting a new value.
   * @returns {Color} A new Color instance with the value set.
   */
  set(color: anyColor): Color {
    if (!Color.isColor(color) && !Color.utilities.isValidColor(color)) {
      this.throwInvalidColor(color)
    }
    return Color.create(color)
  }

  /**
   * Calculates the Color's contrast in comparision to another color.
   *
   * @param {anyColor} color to which te contrast will be calculated.
   * @returns {number} The contrast ratio.
   */
  calculateContrastTo(color: anyColor): number {
    return Color.utilities.calculateContrastRatio(this.hex, Color.isColor(color) ? color.hex : color)
  }

  /**
   * Checks if the Color's value is the same as the tested one.
   *
   * @param {anyColor} color to be tested with.
   * @returns {boolean} Is the value the same?
   */
  equals(color: anyColor): boolean {
    let values: colorValues
    if (Color.isColor(color)) {
      values = (color as Color).values
    } else if (Color.utilities.isValidColor(color)) {
      values = Color.utilities.parseColor(color)
    } else {
      return false
    }
    const currentValues = this.values
    return values.every((value, index) => value === currentValues[index])
  }

  /**
   * Allow using the Color object in a string context. Returns a normalized hex color.
   *
   * @returns {string} Stringified Color's value (in the hex format).
   */
  toString(): string {
    return this.getColor(ColorTypes.hex)
  }

  /**
   * Returns a color value in requested format.
   *
   * @param {ColorType} ofType type of the returned color.
   * @returns {basicColor} The color string.
   */
  private getColor(ofType: ColorTypes): basicColor {
    return Color.utilities.convertRawValuesTo(this.color, ofType)
  }

  /**
   * A shortcut to throw the invalid color error.
   *
   * @param {basicColor} color that is invalid.
   */
  private throwInvalidColor(color?: basicColor): never {
    throw new TypeError(`Can't set a new color. "${color}" is not in a recognized format.`)
  }
}
