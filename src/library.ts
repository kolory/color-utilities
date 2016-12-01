import {hexColor, hexColorValues, colorValues, RGBColor} from './types'

/**
 * Utility library for parsing colors, validation, normalization and some other useful features.
 */
export class ColorUtilities {
  /**
   * A dictionary of color values. USes hex values by default.
   */
  static readonly color: {[index: string]: hexColor} = {
    black: '#000000',
    white: '#FFFFFF'
  }

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
      .map(inSRGB => (inSRGB <= 0.03928) ? inSRGB / 12.92 : ((inSRGB + 0.055) / 1.055) ** 2.4)
      .reduce((acc, value, index) => acc + value * multipliers[index], 0)
  }

  /**
   * Calculates a contrast ratio of two colors. Based on the W3C Recommendation. Method ensures the proper
   * order of color values, so it doesn't matter which color is brighter.
   * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
   *
   * @param {hexColor} color1 Calculate this color's contrast ratio…
   * @param {hexColor} color2 to this color.
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

  /**
   * Transforms the RGB color string into its color values.
   *
   * @throws TypeError
   * @param rgbColor to be transformed
   * @returns {colorValues} RGB triplet of the provided hex color
   */
  parseRGBColor(rgbColor: RGBColor): colorValues {
    return this.splitRgbColor(this.normalizeRgbColor(rgbColor)) as colorValues
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
   * @param potentialHexColor Might-be-valid-or-not rgb color string.
   * @returns {boolean} Is it valid?
   */
  isValidHexColor(potentialHexColor?: hexColor): boolean {
    return Boolean(potentialHexColor && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(potentialHexColor))
  }

  /**
   * Validates the provided RGB color.
   *
   * @example
   * 'rgb(1,1,1)' => true
   * 'rgb(123, 255, 0)' => true
   * ' rgb  (   12,    12,1   )   ' => true
   * 'RGB(255, 0, 0)' => true
   * 'Xrgb(0, 1, 2)' => false
   * 'rgb(256, 255, 255)' => false
   *
   * @param potentialRgbColor
   * @returns {boolean}
   */
  isValidRgbColor(potentialRgbColor?: RGBColor): boolean {
    if (!potentialRgbColor) {
      return false
    } else {
      return this.doesRgbHasValidFormat(potentialRgbColor) && this.areRgbValuesInRange(potentialRgbColor)
    }
  }

  /**
   * Tests if the provided RGB color is in a valid format, eg. "rgb(1, 2, 3)".
   * @param potentialRgbColor
   * @returns {boolean}
   */
  private doesRgbHasValidFormat(potentialRgbColor: RGBColor): boolean {
    return /^rgb\((\d{1,3}\,){2}\d{1,3}\)$/.test(potentialRgbColor.replace(/\s/g, '').toLowerCase())
  }

  /**
   * Tests if the values of the provided RGB color are in 0-255 range.
   * @param potentialRgbColor
   * @returns {boolean}
   */
  private areRgbValuesInRange(potentialRgbColor: RGBColor): boolean {
    // Typecasting is safe here, since this.isValidRgbColor ensures the valid format first.
    const values = potentialRgbColor.match(/\d{1,3}/g) as string[]
    return values.every(stringValue => !/^0\d/.test(stringValue)) &&
       values.map(stringValue => Number(stringValue)).every(value => value >= 0 && value <= 255)
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

  /**
   * Splits the rgba color string into the an array of color values.
   *
   * @example
   * "rgba(255, 0, 1)" => [255, 0, 1]
   *
   * @param rgbColor
   * @returns {Number[]}
   */
  splitRgbColor(rgbColor: RGBColor): colorValues {
    return (rgbColor.match(/\d{1,3}/g) as string[]).map(stringValue => Number(stringValue)) as colorValues
  }

  /* Normalizers */

  /**
   * Changes the shorthand hex colors into their full, 6 characters long representation. Returned value is uppercased.
   *
   * @example
   * "#fff" => "#FFFFFF"
   * "123" => "#112233"
   *
   * @throws TypeError
   * @param hexColor to be normalized
   * @returns {any}
   */
  normalizeHexColor(hexColor: hexColor): hexColor {
    const potentialColor = hexColor[0] !== '#' ? '#' + hexColor : hexColor
    this.throwIfInvalidHexColor(potentialColor)

    if (potentialColor.length === 4) {
      return potentialColor.split('')
        .reduce((acc, digit, index) => index !== 0 ? [...acc, digit, digit] : acc, ['#'])
        .join('')
        .toUpperCase()
    } else {
      return potentialColor.toUpperCase()
    }
  }

  /**
   * Normaizes casing ans spacing in the provided rgb color.
   *
   * @example
   * ' RGB  ( 11,  11,11  )   ' => 'rgb(11, 11, 11)
   *
   * @param rgbColor to be normalized.
   * @returns {string} Normalized rgb color string.
   */
  normalizeRgbColor(rgbColor: RGBColor): RGBColor {
    const potentialColor = rgbColor.toLowerCase()
    this.throwIfInvalidRgbColor(potentialColor)
    return potentialColor.replace(/\s/g, '').replace(/,/g, ', ')
  }

  /* Supporting internal methods */

  /**
   * Parses the base-16 number to base-10.
   * @internal
   * @param hex as base 16 number
   * @returns {number} base 10 number
   */
  private changeHexToNumber(hex: string): number {
    return parseInt(hex, 16)
  }

  /**
   * A shortcut to throw an error when provided number was invalid.
   * @internal
   * @param {hexColor} hexColor An invalid color
   */
  private throwInvalidHexColor(hexColor?: hexColor): never {
    throw new TypeError(`Using invalid hex color value. Used "${hexColor}" but only #RGB and #RRGGBB are allowed.`)
  }

  /**
   * Validation combined with the error throwing. Just to make the code that needs this behavior shorter.
   * @internal
   * @param {hexColor} hexColor An invalid color
   */
  private throwIfInvalidHexColor(hexColor?: hexColor): void {
    if (!this.isValidHexColor(hexColor)) {
      this.throwInvalidHexColor(hexColor)
    }
  }

  /**
   * A shortcut to throw an error when provided number was invalid.
   * @internal
   * @param {RGBColor} rgbColor An invalid color
   */
  private throwInvalidRgbColor(rgbColor?: RGBColor): never {
    throw new TypeError(`Using invalid RGB color format. Used "${rgbColor}" rgb(123, 123, 123) is allowed.`)
  }

  /**
   * Validation combined with the error throwing. Just to make the code that needs this behavior shorter.
   * @internal
   * @param {RGBColor} rgbColor An invalid color
   */
  private throwIfInvalidRgbColor(rgbColor?: RGBColor): void {
    if (!this.isValidRgbColor(rgbColor)) {
      this.throwInvalidRgbColor(rgbColor)
    }
  }
}
