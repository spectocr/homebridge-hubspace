import { Logger } from 'homebridge';
/**
 * Service for managing JWT tokens
 */
export declare class TokenService {
    private readonly _username;
    private readonly _password;
    private readonly _log;
    private static _instance;
    private readonly _httpClient;
    private _accessToken?;
    private _accessTokenExpiration?;
    private _refreshToken?;
    private _refreshTokenExpiration?;
    private readonly _tokenFilePath;
    private _authPromise?;
    private constructor();
    /**
     * {@link TokenService} instance
     */
    static get instance(): TokenService;
    /**
     * Initializes {@link TokenService}
     * @param _username Account username
     * @param _password Account password
     * @param storagePath Homebridge storage path for persisting refresh token
     */
    static init(username: string, password: string, storagePath: string, log: Logger): void;
    getToken(): Promise<string | undefined>;
    hasValidToken(): boolean;
    private authenticate;
    private getTokenFromRefreshToken;
    private getTokenFromCredentials;
    /**
     * Sets tokens to new values
     * @param response Response with tokens
     */
    private setTokens;
    /**
     * Clears stored tokens
     */
    private clearTokens;
    private persistToken;
    private loadPersistedToken;
    /**
     * Checks whether the access token is expired
     * @returns True if access token is expired otherwise false
     */
    private isAccessTokenExpired;
    /**
     * Checks whether the refresh token is expired
     * @returns True if refresh token is expired otherwise false
     */
    private isRefreshTokenExpired;
}
//# sourceMappingURL=token.service.d.ts.map