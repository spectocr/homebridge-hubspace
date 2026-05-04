"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConfigValid = void 0;
/**
 * Checks whether all configuration values are valid
 * @param config Config object
 * @returns True if plugin configuration is valid otherwise false
 */
function isConfigValid(config) {
    return !(!config.username ||
        !config.password ||
        !config.name);
}
exports.isConfigValid = isConfigValid;
//# sourceMappingURL=config.js.map