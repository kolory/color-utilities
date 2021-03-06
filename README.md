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

// Create using a `new` keyword or with a factory (preferred).
const colorUtilitiesFromFactory = ColorUtilities.create() // Preferred.
const colorUtilities = new ColorUtilities()
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
#convert(color: basicColor, to: ColorTypes | 'hex' | 'rgb' | 'hsl'): basicColor
#convertToHex(color: basicColor): basicColor
#convertToRgb(color: basicColor): basicColor
#convertToHsl(color: basicColor): basicColor
```

Converts a color into a different format (eg. hex to RGB or HSL to hex). Use either the generic `convert` method providing
a color to be converted with the outcome format (from the `ColorType` enum or as a string) or one of the specific method .

##### Parameters
`color` - A valid color that will be converted.
`to` - (in the `#convert` generic method) a color type (coming from the `ColorTypes` enum) into which the color should be converted.

##### Returns

A valid color in another format.

##### Example

```
import {ColorTypes} from '@kolory/color-utilities'
colorUtilities.convert('#F03402', ColorTypes.hsl) // => 'hsl(13, 98%, 47%)'
colorUtilities.convert('hsl(39, 100%, 50%)', ColorTypes.rgb) // => 'rgb(255, 166, 0)'
colorUtil.convertToRgb('#FFA500') // => 'rgb(255, 165, 0)'
colorUtil.convertToHsl('rgb(255, 166, 0)') // => 'hsl(39, 100%, 50%)'
colorUtil.convertToHex('hsl(39, 100%, 50%)') // => '#FFA600'
```

#### Convert a raw color values to the color format
```
#convertRawValuesTo(values: colorValues, to: ColorTypes): basicColor
```

Converts a raw color values (a triplet array: [R, G, B]) into a formatted string (eg. hex to RGB or HSL to hex).

##### Parameters
`values` - A raw values.
`to` - a color type (coming from the `ColorTypes` enum) into which the color should be converted.

##### Returns

A valid color in another format.

##### Example

```
colorUtilities.convertRawValuesTo([255, 165, 0], ColorTypes.hex) // => '#FFA500'
```

### Parsers

#### Parse any color
```
#parseColor(color: basicColor): colorValues
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
colorUtilities.parseColor('#FFAA500') // => [255, 165, 0]
colorUtilities.parseColor('#fff') // => [255, 255, 255]
colorUtilities.parseColor('rgb(255, 165, 0)') // => [255, 165, 0]
colorUtilities.parseColor('rgb(255, 255, 255)') // => [255, 255, 255]
colorUtilities.parseColor('hsl(0, 100%, 100%)') // => [255, 255, 255]
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
colorUtilities.parseHexColor('#FFAA500') // => [255, 165, 0]
colorUtilities.parseHexColor('#fff') // => [255, 255, 255]
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
colorUtilities.parseHexColor('rgb(255, 165, 0)') // => [255, 165, 0]
colorUtilities.parseHexColor('rgb(255, 255, 255)') // => [255, 255, 255]
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
colorUtilities.parseHslColor('hsl(123, 100%, 100%)') // => [255, 255, 255]
```

### Validators

#### Validate a color
```
#isValidColor(potentialColor?: basicColor): boolean
```
Checks if the provided color is a valid hexadecimal color, an RGB color or an HSL color. Uses specific validators
internally, so the edge cases from them applies here.

##### Parameters

`color` - A color to be validated.

##### Returns
A boolean indicating validity of the color. For clarity sake: `true` means the color is valid.

##### Examples
```
colorUtilities.isValidColor('#FFA500') // => true 
colorUtilities.isValidColor('rgb(255, 165, 0)') // => true
colorUtilities.isValidColor('hsl(200, 100%, 50%)') // => true
colorUtilities.isValidColor('#QWERTY') // => false 
colorUtilities.isValidColor('#123456789') // => false
colorUtilities.isValidColor(null) // => false
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
colorUtilities.isValidHexColor('#FFA500') // => true 
colorUtilities.isValidHexColor('#fff') // => true
colorUtilities.isValidHexColor('#QWERTY') // => false 
colorUtilities.isValidHexColor('#123456789') // => false
colorUtilities.isValidHexColor(null) // => false
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
colorUtilities.isValidRgbColor('rgb(0, 0, 0)') // => true 
colorUtilities.isValidRgbColor('rgb(255, 165, 0') // => true
colorUtilities.isValidRgbColor('xrgb(255, 255, 255') // => false 
colorUtilities.isValidRgbColor('rgb(300, 300, 300') // => false
colorUtilities.isValidRgbColor(null) // => false
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
colorUtilities.isValidHslColor('hsl(123, 100%, 10%)') // => true 
colorUtilities.isValidHslColor('hsl(255, 1%, 40%') // => true
colorUtilities.isValidHslColor('xhsl(255, 255, 255') // => false 
colorUtilities.isValidHslColor('hsl(400, 50%, 50%') // => false
colorUtilities.isValidHslColor('hsl(100, 50, 50') // => false
colorUtilities.isValidHslColor(null) // => false
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
colorUtilities.splitHexColor('#FFA500') // => ['FF', 'A5', '00']
colorUtilities.splitHexColor('#fff') // => ['FF', 'FF', 'FF']

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
colorUtilities.splitRgbColor('rgb(255, 165, 0)') // => [255, 165, 0]
colorUtilities.splitRgbColor('rgb(255, 255, 255)') // => [255, 255, 255]

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
colorUtilities.splitHslColor('hsl(39, 100%, 50%)') // => [255, 166, 0]
colorUtilities.splitHslColor('hsl(0, 100%, 100%)') // => [255, 255, 255]

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
colorUtilities.normalizeHexColor('#fff') // => '#FFFFFF'

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
colorUtilities.normalizeRgbColor('  RGB (  123,      123,1  )') // => 'rgb(123, 123, 1)

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
colorUtilities.normalizeHslColor('  HSL (  123,      100%,1%  )') // => 'hsl(123, 100%, 1%)

```

### Utilities

#### Calculate luminance of a color
```
#calculateLuminanceOf(color: basicColor): number
```
Calculates the relative luminance of a color, as defined in the
[W3C Specification](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef).

##### Parameters
`color` - A valid color.

##### Returns
A number representing the relative luminance in [0-1] range.

##### Examples
```
colorUtilities.calculateLuminanceOf('#FFFFFF') // => 1
colorUtilities.calculateLuminanceOf('rgb(255, 255, 255)') // => 1
colorUtilities.calculateLuminanceOf('hsl(100, 100%, 100%)') // => 1
colorUtilities.calculateLuminanceOf('#000000') // => 0
colorUtilities.calculateLuminanceOf('#FFA500') // => 0.48170267036309633

```

#### Calculate contrast between two colors
```
#calculateContrastRatio(color1: basicColor, color2: basicColor): number
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
colorUtilities.calculateContrastRatio('#FFFFFF', '#000000') // => 21
colorUtilities.calculateContrastRatio('rgb(255, 255, 255)', 'rgb(0, 0, 0)') // => 21
colorUtilities.calculateContrastRatio('#000000', '#000000') // => 1
colorUtilities.calculateContrastRatio('#FFA500', '#000000') // => 11
colorUtilities.calculateContrastRatio('hsl(100, 100%, 100%)', '#000000') // => 21
```

## Color object
An object designed to abstract the color's formatting to make it easier to work with in different scenarios.

### Creation
The Color object can be created by using the factory method. While the typical class instantation
with a `new` keyword is supported and is functionally equivalent, it's discouraged as not future proof. Whenever you can,
prever `Color.create()` over `new Color()`.

The creating method can optionally be provided with a raw color value (RGB, HEX, HSL) or with another Color object.
In the second case, the provided object is returned. When used without any color, the default white is used.

```
const red = Color.create('#FF0000')
const green = Color.create('#00FF00')
const blue = Color.create(0, 0, 255)

// Discouraged, but functionally equivalent.
const black = new Color('#000')
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
Color.create(color?: anyColor): Color
```

Creates a new color object (a factory method). Refer to the "Creation" section for more information.

#### Check if an object is of the Color type
```
Color.isColor(color?: anyColor): boolean
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
#set(color: anyColor): Color
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
#calculateContrastTo(color: anyColor): number
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
#equals(color: anyColor): boolean
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

## Colors types
Since all color are essentaily strings, the library aliases them for more explicit typing. Those types are exported for
consumers to use them together with the library or as a standalone definitions.

### Basic types
There are three basic color types:
- `hexColor` used for colors in the HEX format,
- `rgbColor` used for colors in the RGB format,
- `hexColor` used for colors in the HSL format.

There's also a `basicColor` type representing all three possible types.

To use them, just import required definitions from the `@kolory/color-utilities` module.

#### Examples
```
import {basicColor, hexColor, rgbColor, hslColor} from '@kolory/color-utilities'

const red: hexColor = '#FF0000'
const green: rgbColor = 'rgb(0, 255, 0)'
const blue: hslColor = 'hsl(240, 100%, 50%)'

let cameleon: basicColor
cameleon = '#FF0000'
cameleon = rgb(0, 255, 0)'
cameleon = 'hsl(240, 100%, 50%)'
```

### Value types
In the internal calculations and raw colors management the library uses three value types representing values colors
are consisted of.

- `hexValue` is used for a single value of the hex color (eg. `A5` in `#FFA500`),
- `hexColorValues`  is a triplet of `hexValue`s and represents all three values of a hex color (eg. `['FF', 'A5', '00']` in `#FFA500`),
- `colorValues` is a triplet of the color's RGB values (eg. `[255, 165, 0]` in `#FFA500`).

#### Examples
```
import {colorValues, hexColorValues} from '@kolory/color-utilities'

const rawValuesOfOrange: colorValues = new ColorUtilities().parseColor('#FFA500')
const hexValuesOfOrange: hexColorValues = new ColorUtilities().splitHexColor('#FFA500')
```

### Any color
When using the [Color Object](https://github.com/kolory/color-utilities#color-object) class that is not included in
any of the basic colors, the `anyColor` type comes in handy. It's a union type of a `basicColor` type ane the type 
of the `Color` class.

#### Examples
```
import {anyColor} from '@kolory/color-utilities'

let rainbow: anyColor
rainbow = '#FF0000'
rainbow = rgb(0, 255, 0)'
rainbow = 'hsl(240, 100%, 50%)'
rainbow = Color.create('#FFA500')
```

## License
MIT
