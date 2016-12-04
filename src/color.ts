import {anyColor, hexColor, RGBColor, HSLColor} from "./types";
import {ColorUtilities} from "./library";
import {ColorTypes} from "./color-types-enum";

export class Color {
  // TODO: static colors

  static create(color?: anyColor): Color {
    return new Color(color)
  }

  private static utils = new ColorUtilities()

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

  constructor(color?: anyColor) {
    if (!color) {
      this.color = '#FFFFFF'
    } else if (!Color.utils.isValidColor(color)) {
      this.throwInvalidColor(color)
    } else {
      this.color = color
    }
  }

  set(color: anyColor): Color {
    if (!Color.utils.isValidColor(color)) {
      this.throwInvalidColor(color)
    }
    return Color.create(color)
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
