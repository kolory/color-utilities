// TODO: Should be exported?
export type RGBColor = string
export type hexColor = string
export type hexValue = string
export type hexColorValues = [hexValue, hexValue, hexValue]
export type anyColor = RGBColor | hexColor
export type colorValues = [number, number, number]

export class ColorUtilities {
  // TODO: Make the version number dynamic
  static readonly VERSION = '0.0.0'

  static readonly black = '#000000'
  static readonly white = '#FFFFFF'

  /* Utilities */

  /**
   * Calculates the relative luminance of a color. Based on the W3C Recommendation.
   * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
   *
   * @param color for which to calculate the luminance
   * @returns {number} relative luminance
   */
  calculateLuminanceOf(color: hexColor): number {
    const multipliers = [0.2126, 0.7152, 0.0722]
    return this.parseHexColor(color)
      .map(value => value / 255)
      .map(inSRGB => (inSRGB <= 0.03928) ? inSRGB / 12.92 : ((inSRGB+0.055)/1.055) ** 2.4)
      .reduce((acc, value, index) => acc + value * multipliers[index], 0)
  }

  /**
   * Calculates a contrast ratio of two colors. Based on the W3C Recommendation.
   * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
   *
   * @param color1
   * @param color2
   * @returns {number} the contrast ratio of provided colors
   */
  calculateContrastRatio(color1: hexColor, color2: hexColor): number {
    return [this.calculateLuminanceOf(color1), this.calculateLuminanceOf(color2)]
      .sort((a, b) => b - a)
      .map(value => value + 0.05)
      .reduce((a, b) => a / b)
  }

  /* Parsers */

  /**
   * Parses valid hex colors into their RGB representation in base 10.
   *
   * @throws TypeError
   * @param hexColor to be transformed
   * @returns {colorValues} RGB triplet of the provided hex color
   */
  parseHexColor(hexColor: hexColor): colorValues {
    return this.splitHexColor(this.normalizeHexColor(hexColor)).map(this.changeHexToNumber) as colorValues
  }

  /* Validators */

  /**
   * Validates the provided hex color.
   *
   * @example
   * "#FFA500" => true
   * "#FFF" => true
   * "#GGG" => false
   * "" => false
   *
   * @param potentialHexColor
   * @returns {hexColor|boolean}
   */
  isValidHexColor(potentialHexColor?: hexColor): boolean {
    return Boolean(potentialHexColor && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(potentialHexColor))
  }

  /* Analyzers */

  /**
   * Splits the solid hex color string into its value parts.
   *
   * @example
   * "#FFA500" => ["FF", "A5", "00"]
   *
   * @param hexColor to te split
   * @returns {hexColorValues}
   */
  splitHexColor(hexColor: hexColor): hexColorValues {
    return [[1, 3], [3, 5], [5, 7]]
      .map(splitRange => hexColor.substring.apply(hexColor, splitRange).toUpperCase()) as hexColorValues
  }

  /* Normalizers */

  /**
   * Changes the shorthand hex colors into their full, 6 characters long representation. Returned value is uppercased.
   *
   * @example
   * "#fff" => "#FFFFFF"
   *
   * @throws TypeError
   * @param hexColor to be normalized
   * @returns {any}
   */
  normalizeHexColor(hexColor: hexColor): hexColor {
    if (!this.isValidHexColor(hexColor)) {
      this.throwInvalidHexColor(hexColor)
    }

    if (hexColor.length === 4) {
      return hexColor.split('')
        .reduce((acc, digit, index) => index !== 0 ? [...acc, digit, digit] : acc, ['#'])
        .join('')
        .toUpperCase()
    } else {
      return hexColor.toUpperCase()
    }
  }

  /* Supporting internal methods */

  private changeHexToNumber(hex: string): number {
    return parseInt(hex, 16);
  }

  /** @internal */
  private throwInvalidHexColor(hexColor?: hexColor): never {
    throw new TypeError(`Using invalid hex color value. Used "${hexColor}" but only #RGB and #RRGGBB are allowed.`)
  }
}
