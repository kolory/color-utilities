# Color utilities
[![Build Status](https://travis-ci.org/radiatingstar/color-utilities.svg?branch=master)](https://travis-ci.org/radiatingstar/color-utilities)
[![Code Climate](https://codeclimate.com/github/radiatingstar/color-utilities/badges/gpa.svg)](https://codeclimate.com/github/radiatingstar/color-utilities)
[![Test Coverage](https://codeclimate.com/github/radiatingstar/color-utilities/badges/coverage.svg)](https://codeclimate.com/github/radiatingstar/color-utilities/coverage)

Collection of useful methods for colors parsing, validation, transformations and calculations.
Exposed as a class, so can be used as a stand-alone, or inside Angular apps.

## Install and use
```
npm install @radiatingstar/color-utilities
```

```
// TypeScript, JavaScript module
import {ColorUtilities} from '@radiatingstar/color-utilities'

// Node, Browserify
var colorUtil = require('@radiatingstar/color-utilities')
```

## Features

### Parsers

#### Parse any color
```
#parseColor(color: anyColor): colorValues
```
Transforms RGB or hex color into an array of RGB values. A generic variant of specific parsers dedicated for
hex and RGB colors.

##### Parameters
`color` - A color in RGB or hex format to be parsed.

##### Returns

An array representation of the provided number. Throws if an invalid color was used (use validators
methods id unsure if the value will always be correct).

##### Example

```
colorUtil.parseHexColor('#FFAA500') // => [255, 165, 0]
colorUtil.parseHexColor('#fff') // => [255, 255, 255]
colorUtil.parseHexColor('rgb(255, 165, 0)') // => [255, 165, 0]
colorUtil.parseHexColor('rgb(255, 255, 255)') // => [255, 255, 255]
```

#### Parse a hexadecimal color
```
#parseHexColor(color: hexColor): colorValues
```
Transforms a hexadecimal color into an array of RGB values in base-10.

##### Parameters

`color` - A hexadecimal color (eg. '#FFA500'). Shorthand notation ('#FFF')
and small caps are also supported.

##### Returns

An array representation of the provided number. Throws if an invalid hex was used (use validators
methods id unsure if the value will always be correct).

##### Examples

```
colorUtil.parseHexColor('#FFAA500') // => [255, 165, 0]
colorUtil.parseHexColor('#fff') // => [255, 255, 255]
```

#### Parse an RGB color
```
#parseRGBColor(color: RGBColor): colorValues
```
Transforms an RGB color into an array of RGB values.

##### Parameters

`color` - An RGB color (eg. 'rgb(255, 265, 0)').

##### Returns

An array representation of the provided number. Throws if an invalid RGB format was used (use validators
methods id unsure if the value will always be correct).

##### Examples

```
colorUtil.parseHexColor('rgb(255, 165, 0)') // => [255, 165, 0]
colorUtil.parseHexColor('rgb(255, 255, 255)') // => [255, 255, 255]
```

### Validators

#### Validate a hexadecimal color
```
#isValidHexColor(potentialHexColor?: hexColor): boolean
```
Checks if the provided color is a valid hexadecimal color.

##### Parameters

`color` - A hexadecimal color (eg. '#FFA500'). Shorthand notation ('#FFF')
and small caps are also supported.

##### Returns
A boolean indicating validity of the color. For clarity sake: `true` means the color is valid.

##### Examples
```
colorUtil.isValidHexColor('#FFA500') // => true 
colorUtil.isValidHexColor('#fff') // => true
colorUtil.isValidHexColor('#QWERTY') // => false 
colorUtil.isValidHexColor('#123456789') // => false
colorUtil.isValidHexColor(null) // => false
```

#### Validate an RGB color
```
#isValidRgbColor(potentialRgbColor?: RGBColor): boolean
```
Checks if the provided color is a valid RGB color.

##### Parameters

`color` - An RGB color (eg. 'rgb(255, 165, 0)').

##### Returns
A boolean indicating validity of the color. For clarity sake: `true` means the color is valid.

##### Examples
```
colorUtil.isValidRgbColor('rgb(0, 0, 0)') // => true 
colorUtil.isValidRgbColor('rgb(255, 165, 0') // => true
colorUtil.isValidRgbColor('xrgb(255, 255, 255') // => false 
colorUtil.isValidRgbColor('rgb(300, 300, 300') // => false
colorUtil.isValidRgbColor(null) // => false
```

### Analyzers

#### Get the hexadecimal color's parts
```
#splitHexColor(color: hexColor): hexColorValues
```
Splits the hexadecimal color into an array of it's hexadecimal RGB values.

##### Parameters

`color` - A hexadecimal color (eg. '#FFA500'). Shorthand notation ('#FFF')
and small caps are also supported. The return value is always normalized to uppercase two letters/numbers
long values.

##### Returns
The result of this method is a 3 items long array of hexadecimal RGB values. 

##### Examples
```
colorUtil.splitHexColor('#FFA500') // => ['FF', 'A5', '00']
colorUtil.splitHexColor('#fff') // => ['FF', 'FF', 'FF']

```

#### Get the RGB color's parts
```
#splitRgbColor(color: RGBColor): colorValues
```
Splits the RGB color into an array of it's RGB values.

##### Parameters

`color` - An RGB color (eg. 'rgb(255, 165, 0)').

##### Returns
The result of this method is a 3 items long array of RGB values. 

##### Examples
```
colorUtil.splitRgbColor('rgb(255, 165, 0)') // => [255, 165, 0]
colorUtil.splitRgbColor('rgb(255, 255, 255)') // => [255, 255, 255]

```

### Normalizers

#### Normalize a hexadecimal color value
```
#normalizeHexColor(hexColor: hexColor): hexColor
```
Transforms a valid hex color into a uniform shape: 6 uppercased characters.

##### Parameters
`color` - A valid hex color that might be written in a shorthand notation or in lower case.
As a bonus, this method considers the colors without initial '#' as semi-valid and adds
the missing sign (validation still reports it's not a valid color).

##### Returns
A valid, 6 characters long (7 with '#') string of uppercased letters and numbers.

##### Examples
```
colorUtil.normalizeHexColor('#fff') // => '#FFFFFF'

```

#### Normalize an RGB color value
```
#normalizeRgbColor(hexColor: RGBColor): RGBColor
```
Transforms a valid RGB color into a uniform shape (lowercased with consistent spacing).

##### Parameters
`color` - A valid RGB color.

##### Returns
A valid, lowercased color string with consistent spacing.

##### Examples
```
colorUtil.normalizeRgbColor('  RGB (  123,      123,1  )') // => 'rgb(123, 123, 1)

```

### Utilities

#### Calculate luminance of a color
```
#calculateLuminanceOf(color: anyColor): number
```
Calculates the relative luminance of a color, as defined in the
[W3C Specification](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef).

##### Parameters
`color` - A valid color.

##### Returns
A number representing the relative luminance in [0-1] range.

##### Examples
```
colorUtil.calculateLuminanceOf('#FFFFFF') // => 1
colorUtil.calculateLuminanceOf('rgb(255, 255, 255)') // => 1
colorUtil.calculateLuminanceOf('#000000') // => 0
colorUtil.calculateLuminanceOf('#FFA500') // => 0.48170267036309633

```

#### Calculate contrast between two colors
```
#calculateContrastRatio(color1: anyColor, color2: anyColor): number
```
Calculates a contrast ratio between two colors, as defined in the
[W3C Specification](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef).

##### Parameters
`color1` - A valid color.
`color2` - A valid color.

##### Returns
A contrast between the provided colors. The value is in range [1-21].

##### Examples
```
colorUtil.calculateContrastRatio('#FFFFFF', '#000000') // => 21
colorUtil.calculateContrastRatio('rgb(255, 255, 255)', 'rgb(0, 0, 0)') // => 21
colorUtil.calculateContrastRatio('#000000', '#000000') // => 1
colorUtil.calculateContrastRatio('#FFA500', '#000000') // => 11

```

## License
MIT
