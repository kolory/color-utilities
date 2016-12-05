import {anyColor, hexColor, RGBColor, HSLColor} from './types'
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

  /* tslint:disable:completed-docs */
  /* Colors shortcuts. */
  static black = new Color('#000000')
  static white = new Color('#FFFFFF')
  static red = new Color('#FF0000')
  static green = new Color('#00FF00')
  static blue = new Color('#0000FF')

  // Current value.
  private color: anyColor
  /* tslint:enable:completed-docs */

  /**
   * Factory method creating a Color object instance. Provide a valid hex, RGB, HSL color or another Color object.
   * For the insight of how the color is created, refer to the constructor's documentation.
   * @param {anyColor | Color} color value to be set.
   * @returns {Color} The color object instance.
   */
  static create(color?: anyColor | Color): Color {
    return new Color(color)
  }

  /**
   * Utility method to check if an object is a Color object.
   * @param {anyColor | Color} color to be checked.
   * @returns {boolean} Is it a Color object?
   */
  static isColor(color?: anyColor | Color): boolean {
    return color instanceof Color
  }

  get hex(): hexColor {
    return this.getColor(ColorTypes.hex)
  }

  get rgb(): RGBColor {
    return this.getColor(ColorTypes.rgb)
  }

  get hsl(): HSLColor {
    return this.getColor(ColorTypes.hsl)
  }

  get R(): number {
    return Color.utilities.parseColor(this.color)[0]
  }

  get G(): number {
    return Color.utilities.parseColor(this.color)[1]
  }

  get B(): number {
    return Color.utilities.parseColor(this.color)[2]
  }

  get luminance(): number {
    return Color.utilities.calculateLuminanceOf(this.color)
  }

  /**
   * Color object is created from:
   * - a valid hex, RGB or HSL color, returning a Color instance;
   * - another color object, returning the same object;
   * - without any color provided, making the new color white.
   *
   * When another Color is used to create a Color instance, then that object is returned instead. Color class is
   * an abstraction of the color itself, so there's no point in creating a new object. It's impossible to create
   * another "white".
   *
   * @throws TypeError
   * @param {anyColor | Color} color to be used during creation.
   * @returns {Color} The new Color instance.
   */
  constructor(color?: anyColor | Color) {
    if (!color) {
      return Color.white
    } else if (color instanceof Color) {
      return color
    } else if (!Color.utilities.isValidColor(color)) {
      this.throwInvalidColor(color)
    } else {
      this.color = color
    }
  }

  /**
   * Sets a new color value returning a new Color object. Original object is not modified for immutability benefits.
   * The initialisation rules are mostly the same when creating a new object, except the set method doesn't allow
   * not using any value.
   *
   * @throws TypeError
   * @param {anyColor | Color} color to be used when setting a new value.
   * @returns {Color} A new Color instance with the value set.
   */
  set(color: anyColor | Color): Color {
    if (!Color.isColor(color) && !Color.utilities.isValidColor(color as anyColor)) {
      this.throwInvalidColor(color as anyColor)
    }
    return Color.create(color)
  }

  /**
   * Calculates the Color's contrast in comparision to another color.
   * @param {anyColor | Color} color to which te contrast will be calculated.
   * @returns {number} The contrast ratio.
   */
  calculateContrastTo(color: anyColor | Color): number {
    return Color.utilities.calculateContrastRatio(this.hex, color instanceof Color ? color.hex : color)
  }

  /**
   * Checks if the Color's value is the same as the tested one.
   * @param {anyColor | Color} color to be tested with.
   * @returns {boolean} Is the value the same?
   */
  equals(color: anyColor | Color): boolean {
    if (Color.isColor(color)) {
      return (color as Color).hex === this.hex
    } else if (Color.utilities.isValidColor(color as anyColor)) {
      return Color.create(color).hex === this.hex
    } else {
      return false
    }
  }

  /**
   * Allow using the Color object in a string context. Returns a normalized hex color.
   * @returns {string} Stringified Color's value (in the hex format).
   */
  toString(): string {
    return this.getColor(ColorTypes.hex)
  }

  /**
   * Returns a color value in requested format.
   * @param {ColorType} ofType type of the returned color.
   * @returns {anyColor} The color string.
   */
  private getColor(ofType: ColorTypes): anyColor {
    return Color.utilities.convert(this.color, ofType)
  }

  /**
   * A shortcut to throw the invalid color error.
   * @internal
   * @param {anyColor} color that is invalid.
   */
  private throwInvalidColor(color?: anyColor): never {
    throw new TypeError(`Can't set a new color. "${color}" is not in a recognized format.`)
  }
}
