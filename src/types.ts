import {Color} from './color'

// Colors
export type rgbColor = string
export type hexColor = string
export type hslColor = string
export type basicColor = rgbColor | hexColor | hslColor
export type anyColor = basicColor | Color

// Values
export type hexValue = string
export type hexColorValues = [hexValue, hexValue, hexValue]
export type colorValues = [number, number, number]
