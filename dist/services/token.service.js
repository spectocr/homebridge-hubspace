"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const endpoints_1 = require("../api/endpoints");
/**
 * Service for managing JWT tokens
 */
class TokenService {
    constructor(_username, _password, storagePath, _log) {
        this._username = _username;
        this._password = _password;
        this._log = _log;
        this._httpClient = axios_1.default.create({
            baseURL: endpoints_1.Endpoints.ACCOUNT_BASE_URL
        });
        this._tokenFilePath = path.join(storagePath, '.hubspace-token.json');
        this.loadPersistedToken();
    }
    /**
     * {@link TokenService} instance
     */
    static get instance() {
        return TokenService._instance;
    }
    /**
     * Initializes {@link TokenService}
     * @param _username Account username
     * @param _password Account password
     * @param storagePath Homebridge storage path for persisting refresh token
     */
    static init(username, password, storagePath, log) {
        TokenService._instance = new TokenService(username, password, storagePath, log);
    }
    async getToken() {
        if (!this.hasValidToken()) {
            await this.authenticate();
        }
        return this._accessToken;
    }
    hasValidToken() {
        return this._accessToken !== undefined && !this.isAccessTokenExpired();
    }
    async authenticate() {
        if (!this.isAccessTokenExpired() && !this.isRefreshTokenExpired())
            return true;
        if (this._authPromise)
            return this._authPromise;
        this._authPromise = (async () => {
            const tokenResponse = await this.getTokenFromRefreshToken() || await this.getTokenFromCredentials();
            this.setTokens(tokenResponse);
            if (!tokenResponse) {
                this._log.error('Authentication failed — check your username and password.');
                return false;
            }
            return true;
        })().finally(() => {
            this._authPromise = undefined;
        });
        return this._authPromise;
    }
    async getTokenFromRefreshToken() {
        // If refresh token is expired then don't even try...
        if (this.isRefreshTokenExpired())
            return undefined;
        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('client_id', 'hubspace_android');
        params.append('refresh_token', this._refreshToken);
        try {
            const response = await this._httpClient.post('/protocol/openid-connect/token', params);
            return response.status === 200 ? response.data : undefined;
        }
        catch (exception) {
            this._log.debug('Refresh token failed, falling back to credentials.');
            return undefined;
        }
    }
    async getTokenFromCredentials() {
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('client_id', 'hubspace_android');
        params.append('username', this._username);
        params.append('password', this._password);
        try {
            const response = await this._httpClient.post('/protocol/openid-connect/token', params);
            return response.status === 200 ? response.data : undefined;
        }
        catch (exception) {
            this._log.error('Credential authentication failed.');
            return undefined;
        }
    }
    /**
     * Sets tokens to new values
     * @param response Response with tokens
     */
    setTokens(response) {
        if (!response) {
            this.clearTokens();
            return;
        }
        this._accessToken = response.access_token;
        this._refreshToken = response.refresh_token;
        const currentDate = new Date();
        this._accessTokenExpiration = new Date(currentDate.getTime() + response.expires_in * 1000);
        this._refreshTokenExpiration = new Date(currentDate.getTime() + response.refresh_expires_in * 1000);
        this.persistToken();
    }
    /**
     * Clears stored tokens
     */
    clearTokens() {
        this._accessToken = undefined;
        this._refreshToken = undefined;
        this._accessTokenExpiration = undefined;
        this._refreshTokenExpiration = undefined;
    }
    persistToken() {
        if (!this._refreshToken || !this._refreshTokenExpiration)
            return;
        try {
            const data = {
                refreshToken: this._refreshToken,
                refreshTokenExpiration: this._refreshTokenExpiration.toISOString(),
            };
            fs.writeFileSync(this._tokenFilePath, JSON.stringify(data), 'utf8');
        }
        catch (_) { /* non-fatal */ }
    }
    loadPersistedToken() {
        try {
            const raw = fs.readFileSync(this._tokenFilePath, 'utf8');
            const data = JSON.parse(raw);
            const expiration = new Date(data.refreshTokenExpiration);
            if (expiration > new Date()) {
                this._refreshToken = data.refreshToken;
                this._refreshTokenExpiration = expiration;
            }
        }
        catch (_) { /* no persisted token, will authenticate with credentials */ }
    }
    /**
     * Checks whether the access token is expired
     * @returns True if access token is expired otherwise false
     */
    isAccessTokenExpired() {
        return !this._accessTokenExpiration || this._accessTokenExpiration < new Date();
    }
    /**
     * Checks whether the refresh token is expired
     * @returns True if refresh token is expired otherwise false
     */
    isRefreshTokenExpired() {
        return !this._refreshTokenExpiration || this._refreshTokenExpiration < new Date();
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map