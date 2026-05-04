"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubspacePlatform = void 0;
const token_service_1 = require("./services/token.service");
const account_service_1 = require("./services/account.service");
const discovery_service_1 = require("./services/discovery.service");
const device_service_1 = require("./services/device.service");
const config_1 = require("./config");
/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
class HubspacePlatform {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.Service = this.api.hap.Service;
        this.Characteristic = this.api.hap.Characteristic;
        this._isInitialized = false;
        if (!(0, config_1.isConfigValid)(config)) {
            this.log.error('Configuration is invalid. Platform will not start.');
            return;
        }
        // Init token service as singleton
        token_service_1.TokenService.init(this.config.username, this.config.password, this.api.user.storagePath(), this.log);
        // Configure private services
        this._discoveryService = new discovery_service_1.DiscoveryService(this);
        // Configure global services
        this.accountService = new account_service_1.AccountService(log);
        this.deviceService = new device_service_1.DeviceService(this);
        // Configure callbacks
        this.accountService.onAccountLoaded(this._discoveryService.discoverDevices.bind(this._discoveryService));
        this.api.on('didFinishLaunching', async () => this.accountService.loadAccount());
        // Mark platform as initialized
        this._isInitialized = true;
    }
    /**
   * This function is invoked when homebridge restores cached accessories from disk at startup.
   * It should be used to setup event handlers for characteristics and update respective values.
   */
    configureAccessory(accessory) {
        // Do not restore cached accessories if there was an error during initialization
        if (!this._isInitialized)
            return;
        this._discoveryService.configureCachedAccessory(accessory);
    }
}
exports.HubspacePlatform = HubspacePlatform;
//# sourceMappingURL=platform.js.map