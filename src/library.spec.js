"use strict";
var library_1 = require('./library');
var basicHexColor = '#FFA500';
var validHexColors = [
    basicHexColor,
    '#aaa',
    '#123',
    '#AAAAAA'
];
var invalidHexColors = [
    'invalid',
    '10AA40',
    // Too many or too few characters
    '#4',
    '#A3',
    '#AB23',
    '#FFAA',
    '#AB233',
    '#aaaaaaa',
    '#GFAA500' // No 'G' in the range
];
var expectedExportedColors = [['white', '#FFFFFF'], ['black', '#000000']];
describe('Color utilities', function () {
    var colorUtil;
    beforeEach(function () {
        colorUtil = new library_1.ColorUtilities();
    });
    describe('Dev information', function () {
        it('should expose some information to consumers', function () {
            expect(library_1.ColorUtilities.VERSION).toEqual(jasmine.stringMatching(/^(\d+\.){2}\d+$/));
        });
    });
    describe('Color definitons', function () {
        it('should expose valid colors', function () {
            expectedExportedColors.forEach(function (_a) {
                var color = _a[0], hexValue = _a[1];
                return expect(library_1.ColorUtilities[color]).toEqual(hexValue);
            });
        });
    });
    describe('Utilities', function () {
        it('should calculate colors luminance', function () {
            expect(colorUtil.calculateLuminanceOf('#FFFFFF')).toBe(1);
            expect(colorUtil.calculateLuminanceOf('#000000')).toBe(0);
            expect(colorUtil.calculateLuminanceOf('#FFA500')).toBeCloseTo(0.48170267036309633);
            expect(colorUtil.calculateLuminanceOf('#00FF00')).toBeCloseTo(0.7152);
            expect(colorUtil.calculateLuminanceOf('#AF3512')).toBeCloseTo(0.11703838572298138);
        });
        it('should calculate the contrast ratio of two colors', function () {
            expect(colorUtil.calculateContrastRatio('#FFFFFF', '#000000')).toBe(21 / 1);
            expect(colorUtil.calculateContrastRatio('#000000', '#000000')).toBe(1 / 1);
            expect(Math.round(colorUtil.calculateContrastRatio('#FFA500', '#000000'))).toBe(11 / 1);
            expect(Math.round(colorUtil.calculateContrastRatio('#FFA500', '#FFFFFF'))).toBe(2 / 1);
        });
    });
    describe('Colors parsing', function () {
        it('should transform hex colors into RGB values array', function () {
            expect(colorUtil.parseHexColor('#FFF')).toEqual([255, 255, 255]);
            expect(colorUtil.parseHexColor('#FFFFFF')).toEqual([255, 255, 255]);
            expect(colorUtil.parseHexColor('#000000')).toEqual([0, 0, 0]);
            expect(colorUtil.parseHexColor('#ffa500')).toEqual([255, 165, 0]);
            expect(colorUtil.parseHexColor(basicHexColor)).toEqual([255, 165, 0]);
        });
        it('should allow using shorthand hex colors', function () {
            expect(colorUtil.parseHexColor('#FFF')).toEqual(colorUtil.parseHexColor('#FFFFFF'));
        });
        it('should treat capitalized and lower case HEX colors in the same way', function () {
            expect(colorUtil.parseHexColor('#ffffff')).toEqual(colorUtil.parseHexColor('#FFFFFF'));
        });
        it('should inform about failed parsing', function () {
            invalidHexColors.forEach(function (invalidColor) { return expect(function () { return colorUtil.parseHexColor(invalidColor); }).toThrowError(TypeError); });
        });
    });
    describe('Color validation', function () {
        it('should validate hex colors', function () {
            validHexColors.forEach(function (color) { return expect(colorUtil.isValidHexColor(color)).toBeTruthy(); });
            invalidHexColors.forEach(function (color) { return expect(colorUtil.isValidHexColor(color)).toBeFalsy(); });
            expect(colorUtil.isValidHexColor(null)).toBeFalsy();
            expect(colorUtil.isValidHexColor(undefined)).toBeFalsy();
            expect(colorUtil.isValidHexColor('')).toBeFalsy();
        });
    });
    describe('Colors analyze', function () {
        it('should allow splitting the hex color into its parts', function () {
            expect(colorUtil.splitHexColor(basicHexColor)).toEqual(['FF', 'A5', '00']);
            expect(colorUtil.splitHexColor('#ffa500')).toEqual(['FF', 'A5', '00']); // note the uppercases characters
        });
    });
    describe('Colors normalization', function () {
        it('should normalize the shorthand hex colors', function () {
            expect(colorUtil.normalizeHexColor('#aaa')).toBe('#AAAAAA');
            expect(colorUtil.normalizeHexColor('#aaaaaa')).toBe('#AAAAAA');
            expect(colorUtil.normalizeHexColor('#fa5')).toBe('#FFAA55');
            expect(colorUtil.normalizeHexColor(basicHexColor)).toBe(basicHexColor);
        });
        it('should not handle invalid hex colors', function () {
            invalidHexColors.forEach(function (invalidColor) { return expect(function () { return colorUtil.normalizeHexColor(invalidColor); }).toThrowError(TypeError); });
        });
    });
});
