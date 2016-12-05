import {anyColor, hexColor, RGBColor, HSLColor} from './types'
import {ColorUtilities} from './library'
import {ColorTypes} from './color-types-enum'

export class Color {
  static utils = new ColorUtilities()

  static black = new Color('#000000')
  static white = new Color('#FFFFFF')

  static create(color?: anyColor | Color): Color {
    return new Color(color)
  }

  static isColor(color?: anyColor | Color): boolean {
    return color instanceof Color
  }

  private color: anyColor

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
    return Color.utils.parseColor(this.color)[0]
  }

  get G(): number {
    return Color.utils.parseColor(this.color)[1]
  }

  get B(): number {
    return Color.utils.parseColor(this.color)[2]
  }

  get luminance(): number {
    return Color.utils.calculateLuminanceOf(this.color)
  }

  /**
   * When another Color is used to create this Color, then that used color is returned. Color class is an abstraction
   * of the color itself, so there's no point in creating a new object. It's impossible to create another "white".
   * @param color
   * @returns {Color}
   */
  constructor(color?: anyColor | Color) {
    if (!color) {
      return Color.white
    } else if (color instanceof Color) {
      return color
    } else if (!Color.utils.isValidColor(color)) {
      this.throwInvalidColor(color)
    } else {
      this.color = color
    }
  }

  set(color: anyColor | Color): Color {
    if (!Color.isColor(color) && !Color.utilities.isValidColor(color as anyColor)) {
      this.throwInvalidColor(color as anyColor)
    }
    return Color.create(color)
  }

  calculateContrastTo(color: anyColor | Color): number {
    return Color.utils.calculateContrastRatio(this.hex, color instanceof Color ? color.hex : color)
  }

  equals(color: anyColor | Color): boolean {
    if (Color.isColor(color)) {
      return (color as Color).hex === this.hex
    } else if (Color.utils.isValidColor(color as anyColor)) {
      return Color.create(color).hex === this.hex
    } else {
      return false
    }
  }

  toString(): string {
    return this.getColor(ColorTypes.hex)
  }

  private getColor(ofType: ColorTypes): anyColor {
    return Color.utils.convert(this.color, ofType)
  }

  private throwInvalidColor(color?: anyColor): never {
    throw new TypeError(`Can't set a new color. "${color}" is not in a recognized format.`)
  }
}
