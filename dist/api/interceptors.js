"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBearerToken = void 0;
const token_service_1 = require("../services/token.service");
/**
 * Adds a Bearer token to the request
 * @param config Axios request configuration
 * @returns Config with Bearer token
 */
async function addBearerToken(config) {
    const token = await token_service_1.TokenService.instance.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}
exports.addBearerToken = addBearerToken;
//# sourceMappingURL=interceptors.js.map