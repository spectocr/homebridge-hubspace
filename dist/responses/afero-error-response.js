"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAferoError = void 0;
const utils_1 = require("../utils");
/**
 * Checks whether error is caused by Afero response
 * @param error Error object to check
 * @returns True if error is from Afero
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAferoError(error) {
    if (error === null || typeof error !== 'object')
        return false;
    return !(0, utils_1.isNullOrUndefined)(error.timestamp, error.status, error.error_description, error.path);
}
exports.isAferoError = isAferoError;
//# sourceMappingURL=afero-error-response.js.map