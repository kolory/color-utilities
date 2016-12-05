# Color utilities
[![Build Status](https://travis-ci.org/kolory/color-utilities.svg?branch=master)](https://travis-ci.org/kolory/color-utilities)
[![Code Climate](https://codeclimate.com/github/kolory/color-utilities/badges/gpa.svg)](https://codeclimate.com/github/kolory/color-utilities)
[![Test Coverage](https://codeclimate.com/github/kolory/color-utilities/badges/coverage.svg)](https://codeclimate.com/github/kolory/color-utilities/coverage)

Collection of useful methods for colors parsing, validation, transformations and calculations.
Exposed as a class, so can be used as a stand-alone, or inside Angular apps.

## Install and use
```
npm install @kolory/color-utilities
```

Use in a JavaScript or TypeScript project:
```
// TypeScript, JavaScript module
import {ColorUtilities} from '@kolory/color-utilities'

// Node, Browserify
const ColorUtilities = require('@kolory/color-utilities')

// Create using a `new` keyword or with a factory.
const colorUtils = new ColorUtilities()
const colorUtilsFromFactory = ColorUtilities.create()
```

Library is compatible with the Angular 2 dependency injection system. Provide it as a dependency in a Component
or NgModule decorator.
```
@Component({
  ...
  providers: [ColorUtilities, ...]
})
class MyComponent {
  consturctor(private colorUtilities: ColorUtilities) {}
}
```

## Features

### Converters

#### Convert a color to another format
```
#convert(color: anyColor, to: ColorTypes): anyColor
```

Converts a color into a different format (eg. hex to RGB or HSL to hex).

##### Parameters
`color` - A valid color that will be converted.
`to` - a color type (coming from the `ColorTypes` enum) into which the color should be converted.

##### Returns

A valid color in another format.

##### Example

```
colorUtils.convert('#F03402', ColorTypes.hsl) // => 'hsl(13, 98%, 47%)'
colorUtil.convert('hsl(39, 100%, 50%)', ColorTypes.rgb) // => 'rgb(255, 166, 0)'
```

#### Convert a raw color values to the color format
```
#convertRawValuesTo(values: colorValues, to: ColorTypes): anyColor
```

Converts a raw color values (a triplet array: [R, G, B]) into a formatted string (eg. hex to RGB or HSL to hex).

##### Parameters
`values` - A raw values.
`to` - a color type (coming from the `ColorTypes` enum) into which the color should be converted.

##### Returns

A valid color in another format.

##### Example

```
colorUtils.convertRawValuesTo([255, 165, 0], ColorTypes.hex) // => '#FFA500'
```

### Parsers

#### Parse any color
```
#parseColor(color: anyColor): colorValues
```
Transforms RGB, HSL or hex color into an array of RGB values. A generic variant of specific parsers dedicated for
hex and RGB colors.

##### Parameters
`color` - A color in RGB, HSL or hex format to be parsed.

##### Returns

An array representation of the provided number. Throws if an invalid color was used (use validators
methods id unsure if the value will always be correct).

##### Example

```
colorUtil.parseColor('#FFAA500') // => [255, 165, 0]
colorUtil.parseColor('#fff') // => [255, 255, 255]
colorUtil.parseColor('rgb(255, 165, 0)') // => [255, 165, 0]
colorUtil.parseColor('rgb(255, 255, 255)') // => [255, 255, 255]
colorUtil.parseColor('hsl(0, 100%, 100%)') // => [255, 255, 255]
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
#parseRgbColor(color: RGBColor): colorValues
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

#### Parse an HSL color
```
#parseHslColor(color: HSLColor): colorValues
```
Transforms an HSL color into an array of RGB values.

##### Parameters

`color` - An HSL color (eg. 'hsl(123, 45%, 0%)').

##### Returns

An array representation of the provided number. Throws if an invalid HSL format was used (use validators
methods id unsure if the value will always be correct).

##### Examples

```
colorUtil.parseHslColor('hsl(123, 100%, 100%)') // => [255, 255, 255]
```

### Validators

#### Validate a color
```
#isValidColor(potentialColor?: anyColor): boolean
```
Checks if the provided color is a valid hexadecimal color, an RGB color or an HSL color. Uses specific validators
internally, so the edge cases from them applies here.

##### Parameters

`color` - A color to be validated.

##### Returns
A boolean indicating validity of the color. For clarity sake: `true` means the color is valid.

##### Examples
```
colorUtil.isValidColor('#FFA500') // => true 
colorUtil.isValidColor('rgb(255, 165, 0)') // => true
colorUtil.isValidColor('hsl(200, 100%, 50%)') // => true
colorUtil.isValidColor('#QWERTY') // => false 
colorUtil.isValidColor('#123456789') // => false
colorUtil.isValidColor(null) // => false
```

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

#### Validate an HSL color
```
#isValidHslColor(potentialHslColor?: HSLColor): boolean
```
Checks if the provided color is a valid HSL color.

##### Parameters

`color` - An HSL color (eg. 'hsl(300, 50%, 50%)').

##### Returns
A boolean indicating validity of the color. For clarity sake: `true` means the color is valid.

##### Examples
```
colorUtil.isValidHslColor('hsl(123, 100%, 10%)') // => true 
colorUtil.isValidHslColor('hsl(255, 1%, 40%') // => true
colorUtil.isValidHslColor('xhsl(255, 255, 255') // => false 
colorUtil.isValidHslColor('hsl(400, 50%, 50%') // => false
colorUtil.isValidHslColor('hsl(100, 50, 50') // => false
colorUtil.isValidHslColor(null) // => false
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

#### Get the HSL color's parts
```
#splitHslColor(color: HSLColor): colorValues
```
Splits the HSL color into an array of it's RGB values.

##### Parameters

`color` - An HSL color (eg. 'hsl(123, 10%, 50%)').

##### Returns
The result of this method is a 3 items long array of RGB values. 

##### Examples
```
colorUtil.splitHslColor('hsl(39, 100%, 50%)') // => [255, 166, 0]
colorUtil.splitHslColor('hsl(0, 100%, 100%)') // => [255, 255, 255]

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
#normalizeRgbColor(rgbColor: RGBColor): RGBColor
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

#### Normalize an HSL color value
```
#normalizeHslColor(hslColor: HSLColor): HSLColor
```
Transforms a valid HSL color into a uniform shape (lowercased with consistent spacing).

##### Parameters
`color` - A valid HSL color.

##### Returns
A valid, lowercased color string with consistent spacing.

##### Examples
```
colorUtil.normalizeHslColor('  HSL (  123,      100%,1%  )') // => 'hsl(123, 100%, 1%)

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
colorUtil.calculateLuminanceOf('hsl(100, 100%, 100%)') // => 1
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
colorUtil.calculateContrastRatio('hsl(100, 100%, 100%)', '#000000') // => 21
```

## Color object
An object designed to abstract the color's formatting to make it easier to work with in different scenarios.

### Creation
The Color object can be created as a typical class, using the `new` keyword with an optional color provided,
or using the factory method, also with an optional color. The creating method can be also provided with another
Color object. In that case, the provided object is returned. When used without any color, the default white is used.

```
const green = new Color('#00FF00')
const red = Color.create('#FF0000')
```

The Color class exposes predefined basic colors that can be used instead of providing their values.

```
const black = Color.black
const white = Color.white
const red = Color.red
const green = Color.green
const blue = Color.blue
```

### Static methods

#### Create a Color object
```
Color.create(color?: anyColor | Color): Color
```

Creates a new color object (a factory method). Refer to the "Creation" section for more information.

#### Check if an object is of the Color type
```
Color.isColor(color?: anyColor | Color): boolean
```

Tests if the provided color is a Color object.

##### Parameters
`color` - Color or an object to be tested.

##### Returns
A boolean informing if the object or color is a Color object.

##### Examples
```
Color.isColor(new Color('#FFFFFF') // => true
Color.isColor('#FFFFFF') // => false
```

### Properties

Color object exposes properties about the color value and allow accessing different formatting of that color.

```
color.hex // => string: color as a hex
color.rgb // => string: color in the RGB format
color.hsl // => string: color in the HSL format
color.R // => number: red value of the color
color.G // => number: green value of the color
color.B // => number: blue value of the color
color.values // => number[]: array of the RGB values (eg. [255, 165, 0])
color.luminance // => number: the color's luminance
```

### Instance methods

#### Set a new value
```
#set(color: anyColor | Color): Color
```

Sets a new color value of the color, returning a new, modified color. This method doesn't actually modify
the color it's invoked on. This method follows the same rules as the "Creation" section, except id doesn't support
an empty call, meaning the desired color have to be provided.

##### Parameters
`color` - Color or a Color object to set.

##### Returns
A new Color object with the color being the one provided.

##### Examples
```
const black = Color.create('#000000')
const white = black.set('#FFFFFF')
black !== white // => true
```

#### Calculate contrast with another color
```
#calculateContrastTo(color: anyColor | Color): number
```

Calculates the contrast of the color compared to another one.

##### Parameters
`color` - Color or a Color object to which te comparison will be made.

##### Returns
A contract value.

##### Examples
```
const black = Color.create('#000000')
const white = Color.create('#FFFFFF')
blac.calculateContrastTo(white) // => 21
```

#### Check the color equality with another one
```
#equals(color: anyColor | Color): boolean
```

Tests if the color object is of the same color as the tested one.

##### Parameters
`color` - Color or a Color object to test.

##### Returns
The test outcome as a boolean. `true` means it's the same color.

##### Examples
```
const black = Color.create('#000000')
const white = Color.create('#FFFFFF')
black.equals(white) // => false
black.equals(new Color('#000000')) // => true
black.equals('#000000') // => true
```

#### Use the color in a string context
```
#color.toString(): hexColor
```

Color object can be used in all places the string is expected. When concatenated with a string (or used in
a template string), it's automatically transformed into it's hex representation. In other cases, the #toString()
method transforms the object into hex.

##### Returns
A hex representation of the Color object.

##### Examples
```
const orange = Color.create('#FFA500')
"Color: " + orange // => "Color: #FFA500"
`I'm an orange with a value ${orange}` // => "I'm an orange with a value #FFA500"
color.toString() // => "#FFA500"
```

## License
MIT
