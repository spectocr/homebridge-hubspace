import { Logger } from 'homebridge';
/**
 * Service for managing account details
 */
export declare class AccountService {
    private readonly _log;
    private readonly _client;
    private _onAccountLoaded?;
    private _accountId;
    constructor(_log: Logger);
    /**
     * Gets the account ID
     */
    get accountId(): string;
    onAccountLoaded(callback: () => Promise<void>): void;
    /**
     * Loads current user account
     * @returns True if load succeeded otherwise false
     */
    loadAccount(): Promise<void>;
}
//# sourceMappingURL=account.service.d.ts.map