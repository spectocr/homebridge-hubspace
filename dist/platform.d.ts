import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, Service, Characteristic, PlatformConfig } from 'homebridge';
import { AccountService } from './services/account.service';
import { DeviceService } from './services/device.service';
/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
export declare class HubspacePlatform implements DynamicPlatformPlugin {
    readonly log: Logger;
    readonly config: PlatformConfig;
    readonly api: API;
    readonly Service: typeof Service;
    readonly Characteristic: typeof Characteristic;
    readonly accountService: AccountService;
    readonly deviceService: DeviceService;
    private readonly _discoveryService;
    private _isInitialized;
    constructor(log: Logger, config: PlatformConfig, api: API);
    /**
   * This function is invoked when homebridge restores cached accessories from disk at startup.
   * It should be used to setup event handlers for characteristics and update respective values.
   */
    configureAccessory(accessory: PlatformAccessory): void;
}
//# sourceMappingURL=platform.d.ts.map