import {hexColor, hexColorValues, colorValues, RGBColor, anyColor, HSLColor} from './types'
import {ColorTypes} from './color-types-enum'

/**
 * Utility library for parsing colors, validation, normalization and some other useful features.
 *
 * // Use in TypeScript or a JavaScript module
 * import {ColorUtilities} from '@radiatingstar/color-utilities'
 *
 * // Use in node Node or Browserify
 * const ColorUtilities = require('@radiatingstar/color-utilities')
 *
 * // Create using a `new` keyword or with a factory.
 * const colorUtils = new ColorUtilities()
 * const colorUtilsFromFactory = ColorUtilities.create()
 */
export class ColorUtilities {
  /**
   * A factory method for obtaining an instance of the service.
   * @returns {ColorUtilities} An instance of the service.
   */
  static create(): ColorUtilities {
    return new ColorUtilities()
  }

  }

  /* Utilities */

  /**
   * Calculates the relative luminance of a color. Based on the W3C Recommendation.
   * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
   *
   * @param {anyColor} color for which to calculate the luminance
   * @returns {number} relative luminance
   */
  calculateLuminanceOf(color: anyColor): number {
    const multipliers = [0.2126, 0.7152, 0.0722]
    return this.parseColor(color)
      .map(value => value / 255)
      .map(inSRGB => (inSRGB <= 0.03928) ? inSRGB / 12.92 : ((inSRGB + 0.055) / 1.055) ** 2.4)
      .reduce((acc, value, index) => acc + value * multipliers[index], 0)
  }

  /**
   * Calculates a contrast ratio of two colors. Based on the W3C Recommendation. Method ensures the proper
   * order of color values, so it doesn't matter which color is brighter.
   * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
   *
   * @param {anyColor} color1 Calculate this color's contrast ratio…
   * @param {anyColor} color2 to this color.
   * @returns {number} the contrast ratio of provided colors
   */
  calculateContrastRatio(color1: anyColor, color2: anyColor): number {
    return [this.calculateLuminanceOf(color1), this.calculateLuminanceOf(color2)]
      .sort((a, b) => b - a)
      .map(value => value + 0.05)
      .reduce((a, b) => a / b)
  }

  /**
   * Finds out what color encoding type is provided. If a not valid color was provided, the
   * ColorTypes.invalidType is returned.
   *
   * @param {anyColor} color Resolve the type of this color.
   * @returns {ColorTypes} The color's type.
   */
  resolveColorType(color: anyColor): ColorTypes {
    if (this.isValidHexColor(color)) {
      return ColorTypes.hex
    } else if (this.isValidRgbColor(color)) {
      return ColorTypes.rgb
    } else if (this.isValidHslColor(color)) {
      return ColorTypes.hsl
    } else {
      return ColorTypes.invalidType
    }
  }

  /* Converters */

  /**
   * Converts a valid color into it's representation in different format.
   *
   * @example
   * colorUtil.convert('#F03402', ColorTypes.hsl) // => 'hsl(13, 98%, 47%)'
   *
   * @param {anyColor} color to be converted.
   * @param {ColorTypes} to this format.
   * @returns {anyColor} converted color.
   */
  convert(color: anyColor, to: ColorTypes): anyColor {
    const values = this.parseColor(color)
    switch (to) {
    case ColorTypes.hex:
      return this.convertValuesToHex(values)
    case ColorTypes.rgb:
      return this.convertValuesToRgb(values)
    case ColorTypes.hsl:
      return this.convertValuesToHsl(values)
    default:
      throw new TypeError(`${to} is not valid color type as an outcome format.`)
    }
  }

  /**
   * Converts the RGB values into a hex color.
   * @param {colorValues} values to be converted.
   * @returns {hexColor} outcome hex color.
   */
  private convertValuesToHex(values: colorValues): hexColor {
    return this.normalizeHexColor(
      values
        .map(value => value < 10 ? '0' + String(value) : value.toString(16))
        .reduce((color, value) => color + value, '#')
    )
  }

  /**
   * Converts the RGB values into an RGB color.
   * @param {colorValues} values to be converted.
   * @returns {RGBColor} outcome RGB color.
   */
  private convertValuesToRgb(values: colorValues): RGBColor {
    return `rgb(${values.join(', ')})`
  }

  /**
   * Converts the RGB values into an HSL color.
   * Algorithm taken from Wikipedia: https://en.wikipedia.org/wiki/HSL_and_HSV#General_approach
   *
   * @param {colorValues} values to be converted.
   * @returns {RGBColor} outcome HSL color.
   */
  private convertValuesToHsl(values: colorValues): HSLColor {
    /* tslint:disable:cyclomatic-complexity */
    const [r, g, b] = values.map(v => v / 255)
    const M = Math.max(r, g, b)
    const m = Math.min(r, g, b)
    const C = M - m

    let intermediaryHue = 0
    if (C) {
      if (M === r) {
        intermediaryHue = ((g - b) / C) % 6
      } else if (M === g) {
        intermediaryHue = (b - r) / C + 2
      } else { // M === b
        intermediaryHue = (r - g) / C + 4
      }
    }

    const hue = Math.round(intermediaryHue * 60)
    const lightness = (M + m) / 2

    let saturation: number
    if (lightness === 1) {
      saturation = 1
    } else if (lightness === 0) {
      saturation = 0
    } else {
      saturation = C / (1 - Math.abs(2 * lightness - 1))
    }

    return `hsl(${hue >= 0 ? hue : 360 + hue}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`
    /* tslint:enable */
  }

  /* Parsers */

  /**
   * A generic parser. Resolves the color type before passing it to specific parsers.
   *
   * @throws TypeError
   * @param {anyColor} color A color to be parsed.
   * @returns {colorValues} RGB triplet of the provided hex color
   */
  parseColor(color: anyColor): colorValues {
    switch (this.resolveColorType(color)) {
    case ColorTypes.hex:
      return this.parseHexColor(color)
    case ColorTypes.rgb:
      return this.parseRgbColor(color)
    case ColorTypes.hsl:
      return this.parseHslColor(color)
    default:
      throw new TypeError(`Trying to pare an invalid color (${color}).`)
    }
  }

  /**
   * Parses valid hex colors into their RGB representation in base 10.
   *
   * @throws TypeError
   * @param {hexColor} hexColor to be transformed
   * @returns {colorValues} RGB triplet of the provided hex color
   */
  parseHexColor(hexColor: hexColor): colorValues {
    return this.splitHexColor(this.normalizeHexColor(hexColor)).map(this.changeHexToNumber) as colorValues
  }

  /**
   * Transforms the RGB color string into its color values.
   *
   * @throws TypeError
   * @param {RGBColor} rgbColor to be transformed
   * @returns {colorValues} RGB triplet of the provided hex color
   */
  parseRgbColor(rgbColor: RGBColor): colorValues {
    return this.splitRgbColor(this.normalizeRgbColor(rgbColor)) as colorValues
  }

  /**
   * Transforms the HSL color string into its color values.
   *
   * @throws TypeError
   * @param {HSLColor} hslColor to be transformed.
   * @returns {colorValues} RGB triplet of the provided hex color.
   */
  parseHslColor(hslColor: HSLColor): colorValues {
    return this.splitHslColor(this.normalizeHslColor(hslColor)) as colorValues
  }

  /* Validators */

  /**
   * Validates the provided color against any specific color type.
   *
   * @param {anyColor?} potentialColor Color to be validated.
   * @returns {boolean} Is this color valid?
   */
  isValidColor(potentialColor?: anyColor): boolean {
    return this.isValidHexColor(potentialColor) || this.isValidRgbColor(potentialColor)
      || this.isValidHslColor(potentialColor)
  }

  /**
   * Validates the provided hex color.
   *
   * @example
   * "#FFA500" => true
   * "#FFF" => true
   * "#GGG" => false
   * "" => false
   *
   * @param {hexColor?} potentialHexColor Might-be-valid-or-not hex color string.
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
   * @param {RGBColor} potentialRgbColor Might-be-valid-or-not rgb color string.
   * @returns {boolean} Is it a valid rgb color string?
   */
  isValidRgbColor(potentialRgbColor?: RGBColor): boolean {
    if (!potentialRgbColor) {
      return false
    } else {
      return this.isFormatValid(potentialRgbColor, /^rgb\((\d{1,3}\,){2}\d{1,3}\)$/)
        && this.isRangeValid(potentialRgbColor, value => value >= 0 && value <= 255)
    }
  }

  /**
   * Validates the potential HSL color.
   *
   * @example
   * 'hsl(123, 12%, 44%) => true
   * 'HSL(123, 12%, 44%) => true
   * 'hsl(400, 200%, 300%) => false
   * 'hsl(123, 12, 44) => false
   *
   * @param {HSLColor?} potentialColor Color to be validated.
   * @returns {boolean} Is this a valid HSL?
   */
  isValidHslColor(potentialColor?: HSLColor): boolean {
    if (!potentialColor) {
      return false
    } else {
      return this.isFormatValid(potentialColor, /^hsl\(\d{1,3},\d{1,3}%,\d{1,3}%\)$/)
        && this.areHslValuesInRange(potentialColor)
    }
  }

  /**
   * Checks if the HSL values are i proper ranges.
   *
   * @param {HSLColor} potentialColor Color to be validated.
   * @returns {boolean} Are the values in range?
   */
  private areHslValuesInRange(potentialColor: HSLColor): boolean {
    return this.isRangeValid(potentialColor, this.validateHslRange)
  }

  /**
   * A function used in the HSL range validation.
   * @param {number} value of the color.
   * @param {number} index it's index in the color values array.
   * @returns {boolean} Is in range?
   */
  private validateHslRange(value: number, index: number): boolean {
    if (index === 0) {
      return value >= 0 && value <= 360
    } else {
      return value >= 0 && value <= 100
    }
  }

  /**
   * Removes unnecessary spaces and makes the color lowercased.
   * @param {anyColor} color to be normalized.
   * @returns {string} Normalized color.
   */
  private trimAndLowercase(color: anyColor): anyColor {
    return color.replace(/\s/g, '').toLowerCase()
  }

  /**
   * Range validator. Takes a color to be validated and validating function used in the Array#every call.
   *
   * @param {RGBColor | HSLColor} color RGB or HSL color to be validated.
   * @param {Function} rangeValidator Function to be used for validation.
   * @returns {boolean} Are values in proper ranges?
   */
  private isRangeValid(color: RGBColor | HSLColor, rangeValidator: (value: number, index?: number) => boolean):
  boolean {
    const values = this.getValues(color)
    return values.every(stringValue => !/^0\d/.test(stringValue)) &&
      values.map(value => Number(value)).every(rangeValidator)
  }

  /**
   * Finds out if the color is in a proper format. The format is a regular expression
   * @param {RGBColor | HSLColor} color to be validated
   * @param {RegExp} validatingRegEx to use against the color.
   * @returns {boolean} Is the color properly formatted?
   */
  private isFormatValid(color: RGBColor | HSLColor, validatingRegEx: RegExp): boolean {
    return validatingRegEx.test(this.trimAndLowercase(color))
  }

  /* Analyzers */

  /**
   * Splits the solid hex color string into its value parts.
   *
   * @example
   * "#FFA500" => ["FF", "A5", "00"]
   *
   * @param {hexColor} hexColor to te split
   * @returns {hexColorValues}
   */
  splitHexColor(hexColor: hexColor): hexColorValues {
    return [[1, 3], [3, 5], [5, 7]]
      .map(splitRange => hexColor.substring.apply(hexColor, splitRange).toUpperCase()) as hexColorValues
  }

  /**
   * Splits the RGB color string into the an array of color values.
   *
   * @example
   * "rgba(255, 0, 1)" => [255, 0, 1]
   *
   * @param {RGBColor} rgbColor An RGB color string.
   * @returns {colorValues} A triplet of the color values.
   */
  splitRgbColor(rgbColor: RGBColor): colorValues {
    return this.getValues(rgbColor).map(Number) as colorValues
  }

  /**
   * Splits the HSL color string into it's RGB values representation.
   *
   * Algorithm taken from Wikipedia: https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSL
   *
   * @param {HSLColor} hslColor to be split.
   * @returns {colorValues} The color's RGB values.
   */
  splitHslColor(hslColor: HSLColor): colorValues {
    const [hue, saturation, lightness] = this.getValues(hslColor).map(Number)
    const normalizedSaturation = saturation / 100
    const normalizedLightness = lightness / 100

    const chroma = (1 - Math.abs(2 * normalizedLightness - 1)) * normalizedSaturation
    const normalizedHue = hue / 60
    const x = chroma * (1 - Math.abs(normalizedHue % 2 - 1))
    const m = (normalizedLightness - chroma / 2)

    /* tslint:disable:cyclomatic-complexity */
    const intermediaryRgbValues = ((H: number, C: number, X: number) => {
      if (H <= 1) {
        return [C, X, 0]
      } else if (H <= 2) {
        return [X, C, 0]
      } else if (H <= 3) {
        return [0, C, X]
      } else if (H <= 4) {
        return [0, X, C]
      } else if (H <= 5) {
        return [X, 0, C]
      } else {
        return [C, 0, X]
      }
    })(normalizedHue, chroma, x)
    /* tslint:enable */

    return intermediaryRgbValues.map(v => v + m).map(v => Math.round(v * 255)) as colorValues
  }

  /**
   * Extracts the values from colors using the regular expression. Returned value is a string, since some
   * methods need to validate it's format before passing it further as a number.
   *
   * @param {anyColor} color from which the values will be extracted.
   * @returns {string[]} Array of values.
   */
  private getValues(color: anyColor): string[] {
    return color.match(/\d{1,3}/g) as string[]
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
   * @param {hexColor} hexColor to be normalized
   * @returns {hexColor}
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
   * Normalizes casing ans spacing in the provided rgb color.
   *
   * @example
   * ' RGB  ( 11,  11,11  )   ' => 'rgb(11, 11, 11)
   *
   * @param {RGBColor} rgbColor to be normalized.
   * @returns {RGBColor} Normalized rgb color string.
   */
  normalizeRgbColor(rgbColor: RGBColor): RGBColor {
    const potentialColor = rgbColor.toLowerCase()
    this.throwIfInvalidRgbColor(potentialColor)
    return potentialColor.replace(/\s/g, '').replace(/,/g, ', ')
  }

  /**
   * Normalizes the HSL colors.
   *
   * @example
   * '   HSL  (123,    49%,51%  )' => 'hsl(123, 49%, 51%)'
   *
   * @param {HSLColor} hslColor to be normalized
   * @returns {HSLColor} Normalized color.
   */
  normalizeHslColor(hslColor: HSLColor): HSLColor {
    const potentialColor = hslColor.toLowerCase()
    this.throwIfInvalidHslColor(potentialColor)
    return potentialColor.replace(/\s/g, '').replace(/,/g, ', ')
  }

  /* Supporting internal methods */

  /**
   * Parses the base-16 number to base-10.
   * @internal
   * @param {string} hex as base 16 number
   * @returns {number} base 10 number
   */
  private changeHexToNumber(hex: string): number {
    return parseInt(hex, 16)
  }

  /**
   * A shortcut to throw an error when provided color was invalid.
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
   * A shortcut to throw an error when provided color was invalid.
   * @internal
   * @param {RGBColor} rgbColor An invalid color
   */
  private throwInvalidRgbColor(rgbColor?: RGBColor): never {
    throw new TypeError(`Using invalid RGB color format. Used "${rgbColor}" but it should look like`
      + `"rgb(123, 123, 123)".`)
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

  /**
   * Validation combined with the error throwing. Just to make the code that needs this behavior shorter.
   * @param {HSLColor} hslColor that will be checked.
   */
  private throwIfInvalidHslColor(hslColor: HSLColor): void {
    if (!this.isValidHslColor(hslColor)) {
      this.throwInvalidHslColor(hslColor)
    }
  }

  /**
   * A shortcut to throw an error when provided color was invalid.
   * @internal
   * @param {HSLColor} hslColor An invalid color.
   */
  private throwInvalidHslColor(hslColor?: HSLColor): never {
    throw new TypeError(`Using invalid RGB color format. Used "${hslColor}" but it should look like` +
      `hsl(123, 50%, 49%).`)
  }
}
