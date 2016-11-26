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
    return potentialHexColor && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(potentialHexColor)
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
