"use strict";
var ColorUtilities = (function () {
    function ColorUtilities() {
    }
    /* Utilities */
    /**
     * Calculates the relative luminance of a color. Based on the W3C Recommendation.
     * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
     *
     * @param color for which to calculate the luminance
     * @returns {number} relative luminance
     */
    ColorUtilities.prototype.calculateLuminanceOf = function (color) {
        var multipliers = [0.2126, 0.7152, 0.0722];
        return this.parseHexColor(color)
            .map(function (value) { return value / 255; })
            .map(function (inSRGB) { return (inSRGB <= 0.03928) ? inSRGB / 12.92 : Math.pow(((inSRGB + 0.055) / 1.055), 2.4); })
            .reduce(function (acc, value, index) { return acc + value * multipliers[index]; }, 0);
    };
    /**
     * Calculates a contrast ratio of two colors. Based on the W3C Recommendation.
     * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
     *
     * @param color1
     * @param color2
     * @returns {number} the contrast ratio of provided colors
     */
    ColorUtilities.prototype.calculateContrastRatio = function (color1, color2) {
        return [this.calculateLuminanceOf(color1), this.calculateLuminanceOf(color2)]
            .sort(function (a, b) { return b - a; })
            .map(function (value) { return value + 0.05; })
            .reduce(function (a, b) { return a / b; });
    };
    /* Parsers */
    /**
     * Parses valid hex colors into their RGB representation in base 10.
     *
     * @throws TypeError
     * @param hexColor to be transformed
     * @returns {colorValues} RGB triplet of the provided hex color
     */
    ColorUtilities.prototype.parseHexColor = function (hexColor) {
        return this.splitHexColor(this.normalizeHexColor(hexColor)).map(this.changeHexToNumber);
    };
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
    ColorUtilities.prototype.isValidHexColor = function (potentialHexColor) {
        return Boolean(potentialHexColor && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(potentialHexColor));
    };
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
    ColorUtilities.prototype.splitHexColor = function (hexColor) {
        return [[1, 3], [3, 5], [5, 7]]
            .map(function (splitRange) { return hexColor.substring.apply(hexColor, splitRange).toUpperCase(); });
    };
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
    ColorUtilities.prototype.normalizeHexColor = function (hexColor) {
        if (!this.isValidHexColor(hexColor)) {
            this.throwInvalidHexColor(hexColor);
        }
        if (hexColor.length === 4) {
            return hexColor.split('')
                .reduce(function (acc, digit, index) { return index !== 0 ? acc.concat([digit, digit]) : acc; }, ['#'])
                .join('')
                .toUpperCase();
        }
        else {
            return hexColor.toUpperCase();
        }
    };
    /* Supporting internal methods */
    ColorUtilities.prototype.changeHexToNumber = function (hex) {
        return parseInt(hex, 16);
    };
    /** @internal */
    ColorUtilities.prototype.throwInvalidHexColor = function (hexColor) {
        throw new TypeError("Using invalid hex color value. Used \"" + hexColor + "\" but only #RGB and #RRGGBB are allowed.");
    };
    // TODO: Make the version number dynamic
    ColorUtilities.VERSION = '0.0.0';
    ColorUtilities.black = '#000000';
    ColorUtilities.white = '#FFFFFF';
    return ColorUtilities;
}());
exports.ColorUtilities = ColorUtilities;
