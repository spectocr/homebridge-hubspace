import { PlatformAccessory } from 'homebridge';
import { HubspacePlatform } from '../platform';
/**
 * Service for discovering and managing devices
 */
export declare class DiscoveryService {
    private readonly _platform;
    private readonly _httpClient;
    private _cachedAccessories;
    constructor(_platform: HubspacePlatform);
    /**
     * Receives accessory that has been cached by Homebridge
     * @param accessory Cached accessory
     */
    configureCachedAccessory(accessory: PlatformAccessory): void;
    /**
     * Discovers new devices
     */
    discoverDevices(): Promise<void>;
    private clearStaleAccessories;
    private registerCachedAccessory;
    private registerNewAccessory;
    private getDevicesForAccount;
    private mapDeviceResponseToModel;
    private getSupportedFunctionsFromResponse;
}
//# sourceMappingURL=discovery.service.d.ts.map