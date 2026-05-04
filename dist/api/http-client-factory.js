"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpClientWithBearerInterceptor = void 0;
const axios_1 = __importDefault(require("axios"));
const interceptors_1 = require("./interceptors");
/**
 * Creates an HTTP client with Bearer interceptor
 * @param config HTTP client configuration
 * @returns HTTP client with Bearer interceptor
 */
function createHttpClientWithBearerInterceptor(config) {
    const client = axios_1.default.create(config);
    client.interceptors.request.use(interceptors_1.addBearerToken);
    return client;
}
exports.createHttpClientWithBearerInterceptor = createHttpClientWithBearerInterceptor;
//# sourceMappingURL=http-client-factory.js.map