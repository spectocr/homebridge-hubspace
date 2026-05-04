"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = exports.kelvinToRgb = exports.rgbToMired = exports.rgbToHsv = exports.hsvToRgb = exports.rgbToHex = exports.hexToRgb = exports.normalizeValue = exports.convertNumberToHexReverse = exports.convertNumberToHex = exports.reverseBytes = exports.isNullOrUndefined = void 0;
/**
 * Checks whether at least one value is null or undefined
 * @param values Values to check
 * @returns True if any value is null or undefined otherwise false
 */
function isNullOrUndefined(...values) {
    return values.some(v => v === undefined || v === null);
}
exports.isNullOrUndefined = isNullOrUndefined;
function reverseBytes(value) {
    const bytes = value.match(/.{2}/g).reverse();
    // join the pairs of characters back into a single string
    return bytes.join('');
}
exports.reverseBytes = reverseBytes;
/**
 * Converts a decimal number to hexadecimal
 * @param number Number to convert to hexadecimal
 * @returns string Number in Hexadecimal format in byte order
 */
function convertNumberToHex(value) {
    const hexValue = value.toString(16);
    return hexValue.length % 2 ? '0' + hexValue : hexValue;
}
exports.convertNumberToHex = convertNumberToHex;
/**
 * Converts a decimal number to hexadecimal
 * @param number Number to convert to hexadecimal
 * @returns string Number in Hexadecimal format in byte order
 */
function convertNumberToHexReverse(value) {
    const hexValue = value.toString(16);
    const paddedHexValue = hexValue.length % 2 ? '0' + hexValue : hexValue;
    return reverseBytes(paddedHexValue);
}
exports.convertNumberToHexReverse = convertNumberToHexReverse;
/**
 * Converts a decimal number to
 * @param originalValue Number to convert to hexadecimal
 */
function normalizeValue(originalValue, minValue, maxValue, newMin, newMax, step) {
    const normalizedValue = (originalValue - minValue) * (newMax - newMin) / (maxValue - minValue) + newMin;
    return Math.round(normalizedValue / step) * step;
}
exports.normalizeValue = normalizeValue;
function hexToRgb(hex) {
    // Convert the hex string to a 6-digit integer
    const hexInt = parseInt(hex, 16);
    // Extract the red, green, and blue components using bit shifting and masking
    const r = (hexInt >> 16) & 0xFF;
    const g = (hexInt >> 8) & 0xFF;
    const b = hexInt & 0xFF;
    // Return the RGB components as an array of numbers
    return [r, g, b];
}
exports.hexToRgb = hexToRgb;
function rgbToHex(r, g, b) {
    const hexR = r.toString(16).padStart(2, '0').toUpperCase();
    const hexG = g.toString(16).padStart(2, '0').toUpperCase();
    const hexB = b.toString(16).padStart(2, '0').toUpperCase();
    return hexR + hexG + hexB;
}
exports.rgbToHex = rgbToHex;
function hsvToRgb(h, s, v) {
    h /= 60;
    s /= 100;
    v /= 100;
    const c = v * s;
    const x = c * (1 - Math.abs((h % 2) - 1));
    const m = v - c;
    let r = 0;
    let g = 0;
    let b = 0;
    if (h >= 0 && h < 1) {
        r = c;
        g = x;
    }
    else if (h >= 1 && h < 2) {
        r = x;
        g = c;
    }
    else if (h >= 2 && h < 3) {
        g = c;
        b = x;
    }
    else if (h >= 3 && h < 4) {
        g = x;
        b = c;
    }
    else if (h >= 4 && h < 5) {
        r = x;
        b = c;
    }
    else if (h >= 5 && h < 6) {
        r = c;
        b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return [r, g, b];
}
exports.hsvToRgb = hsvToRgb;
function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    let h = 0;
    let s = 0;
    const v = max;
    if (diff > 0) {
        s = (diff / max) * 100;
        if (max === r) {
            h = (60 * ((g - b) / diff) + 360) % 360;
        }
        else if (max === g) {
            h = (60 * ((b - r) / diff) + 120) % 360;
        }
        else if (max === b) {
            h = (60 * ((r - g) / diff) + 240) % 360;
        }
    }
    return [h, s, v * 100];
}
exports.rgbToHsv = rgbToHsv;
function rgbToMired(rgb) {
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];
    // Normalize RGB values
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    // Calculate the chromaticity coordinates
    const x = 0.4124 * rNorm + 0.3576 * gNorm + 0.1805 * bNorm;
    const y = 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
    // const z = 0.0193 * rNorm + 0.1192 * gNorm + 0.9505 * bNorm;
    // Calculate the color temperature using the McCamy formula
    const n = (x - 0.332) / (0.1858 - y);
    const colorTemperature = (437 * Math.pow(n, 3)) + (3601 * Math.pow(n, 2)) + (6831 * n) + 5517;
    // Convert color temperature to mireds
    const mireds = 1000000 / colorTemperature;
    return mireds;
}
exports.rgbToMired = rgbToMired;
function kelvinToRgb(kelvin) {
    const temperature = kelvin / 100;
    let red, green, blue;
    if (temperature <= 66) {
        red = 255;
        green = 99.4708025861 * Math.log(temperature) - 161.1195681661;
        blue = temperature <= 19 ? 0 : 138.5177312231 * Math.log(temperature - 10) - 305.0447927307;
    }
    else {
        red = 329.698727446 * Math.pow(temperature - 60, -0.1332047592);
        green = 288.1221695283 * Math.pow(temperature - 60, -0.0755148492);
        blue = 255;
    }
    return [clamp(red, 0, 255), clamp(green, 0, 255), clamp(blue, 0, 255)];
}
exports.kelvinToRgb = kelvinToRgb;
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
exports.clamp = clamp;
//# sourceMappingURL=utils.js.map