# Color utilities

Collection of useful methods for colors parsing, validation, transformations and calculations.
Exposed as a class, so can be used as a stand-alone, or inside Angular apps.

## Install and use
```
npm install @rs/color-utilities
```

```
// TypeScript, JavaScript module
import {ColorUtilities} from '@rs/color-utilities'

// Node, browserify
var colorUtil = require('@rs/color-utilities')
```

## Features

### Parsers

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
colorUtil.normalizeHexColor('#fff') // => ['FF', 'FF', 'FF']

```

### Utilities

#### Calculate luminance of a color
```
#calculateLuminanceOf(color: hexColor): number
```
Calculates the relative luminance of a color, as defined in the
[W3C Specification](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef).

##### Parameters
`color` - A valid hex color that might be written in a shorthand notation or in lower case.

##### Returns
A number representing the relative luminance in [0-1] range.

##### Examples
```
colorUtil.calculateLuminanceOf('#FFFFFF') // => 1
colorUtil.calculateLuminanceOf('#000000') // => 0
colorUtil.calculateLuminanceOf('#FFA500') // => 0.48170267036309633

```

#### Calculate contrast between two colors
```
#calculateContrastRatio(color1: hexColor, color2: hexColor): number
```
Calculates a contrast ratio between two colors, as defined in the
[W3C Specification](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef).

##### Parameters
`color1` - A valid hex color that might be written in a shorthand notation or in lower case.
`color2` - A valid hex color that might be written in a shorthand notation or in lower case.

##### Returns
A contrast between the provided colors. The value is in range [1-21].

##### Examples
```
colorUtil.calculateContrastRatio('#FFFFFF', '#000000') // => 21
colorUtil.calculateContrastRatio('#000000', '#000000') // => 1
colorUtil.calculateContrastRatio('#FFA500', '#000000') // => 11

```

## License
MIT
