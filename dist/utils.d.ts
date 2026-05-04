/**
 * Checks whether at least one value is null or undefined
 * @param values Values to check
 * @returns True if any value is null or undefined otherwise false
 */
export declare function isNullOrUndefined(...values: unknown[]): boolean;
export declare function reverseBytes(value: string): string;
/**
 * Converts a decimal number to hexadecimal
 * @param number Number to convert to hexadecimal
 * @returns string Number in Hexadecimal format in byte order
 */
export declare function convertNumberToHex(value: number): string;
/**
 * Converts a decimal number to hexadecimal
 * @param number Number to convert to hexadecimal
 * @returns string Number in Hexadecimal format in byte order
 */
export declare function convertNumberToHexReverse(value: number): string;
/**
 * Converts a decimal number to
 * @param originalValue Number to convert to hexadecimal
 */
export declare function normalizeValue(originalValue: number, minValue: number, maxValue: number, newMin: number, newMax: number, step: number): number;
export declare function hexToRgb(hex: string): [number, number, number];
export declare function rgbToHex(r: number, g: number, b: number): string;
export declare function hsvToRgb(h: number, s: number, v: number): [number, number, number];
export declare function rgbToHsv(r: number, g: number, b: number): [number, number, number];
export declare function rgbToMired(rgb: [number, number, number]): number;
export declare function kelvinToRgb(kelvin: number): [number, number, number];
export declare function clamp(value: number, min: number, max: number): number;
//# sourceMappingURL=utils.d.ts.map