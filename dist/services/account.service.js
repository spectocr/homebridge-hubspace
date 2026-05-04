"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const endpoints_1 = require("../api/endpoints");
const http_client_factory_1 = require("../api/http-client-factory");
/**
 * Service for managing account details
 */
class AccountService {
    constructor(_log) {
        this._log = _log;
        this._client = (0, http_client_factory_1.createHttpClientWithBearerInterceptor)({
            baseURL: endpoints_1.Endpoints.API_BASE_URL
        });
        this._accountId = '';
    }
    /**
     * Gets the account ID
     */
    get accountId() {
        return this._accountId;
    }
    onAccountLoaded(callback) {
        this._onAccountLoaded = callback;
    }
    /**
     * Loads current user account
     * @returns True if load succeeded otherwise false
     */
    async loadAccount() {
        var _a;
        try {
            const response = await this._client.get('/users/me');
            this._accountId = response.data.accountAccess[0].account.accountId;
            if (this._onAccountLoaded) {
                this._onAccountLoaded();
            }
        }
        catch (ex) {
            const axiosError = ex;
            const friendlyMessage = ((_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.status) === 401 ? 'Incorrect username or password' : axiosError.message;
            this._log.error('Failed to load account information.', friendlyMessage);
        }
    }
}
exports.AccountService = AccountService;
//# sourceMappingURL=account.service.js.map