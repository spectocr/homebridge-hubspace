"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryService = void 0;
const settings_1 = require("../settings");
const endpoints_1 = require("../api/endpoints");
const http_client_factory_1 = require("../api/http-client-factory");
const device_type_1 = require("../models/device-type");
const device_accessory_factory_1 = require("../accessories/device-accessory-factory");
const device_functions_1 = require("../models/device-functions");
/**
 * Service for discovering and managing devices
 */
class DiscoveryService {
    constructor(_platform) {
        this._platform = _platform;
        this._httpClient = (0, http_client_factory_1.createHttpClientWithBearerInterceptor)({
            baseURL: endpoints_1.Endpoints.API_BASE_URL,
            headers: {
                host: 'semantics2.afero.net'
            }
        });
        this._cachedAccessories = [];
    }
    /**
     * Receives accessory that has been cached by Homebridge
     * @param accessory Cached accessory
     */
    configureCachedAccessory(accessory) {
        // add the restored accessory to the accessories cache so we can track if it has already been registered
        this._cachedAccessories.push(accessory);
    }
    /**
     * Discovers new devices
     */
    async discoverDevices() {
        const devices = await this.getDevicesForAccount();
        // loop over the discovered devices and register each one if it has not already been registered
        for (const device of devices) {
            // see if an accessory with the same uuid has already been registered and restored from
            // the cached devices we stored in the `configureAccessory` method above
            let existingAccessory = this._cachedAccessories.find(accessory => accessory.UUID === device.uuid);
            if (existingAccessory) {
                // the accessory already exists
                this._platform.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);
                this.registerCachedAccessory(existingAccessory, device);
            }
            else {
                // the accessory does not yet exist, so we need to create it
                this._platform.log.info('Adding new accessory:', device.name);
                existingAccessory = this.registerNewAccessory(device);
            }
            (0, device_accessory_factory_1.createAccessoryForDevice)(device, this._platform, existingAccessory);
        }
        this.clearStaleAccessories(this._cachedAccessories.filter(a => !devices.some(d => d.uuid === a.UUID)));
    }
    clearStaleAccessories(staleAccessories) {
        // Unregister them
        this._platform.api.unregisterPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, staleAccessories);
        // Clear the cache array to reflect this change
        for (const accessory of staleAccessories) {
            const cacheIndex = this._cachedAccessories.findIndex(a => a.UUID === accessory.UUID);
            if (cacheIndex < 0)
                continue;
            this._platform.log.info('Removing stale accessory:', accessory.displayName);
            this._cachedAccessories.splice(cacheIndex, 1);
        }
    }
    registerCachedAccessory(accessory, device) {
        accessory.context.device = device;
        this._platform.api.updatePlatformAccessories([accessory]);
    }
    registerNewAccessory(device) {
        const accessory = new this._platform.api.platformAccessory(device.name, device.uuid);
        accessory.context.device = device;
        this._platform.api.registerPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [accessory]);
        return accessory;
    }
    async getDevicesForAccount() {
        try {
            const response = await this._httpClient.get(`accounts/${this._platform.accountService.accountId}/metadevices`);
            // Get only leaf devices with type of 'device'
            return response.data
                .filter(d => d.children.length === 0 && d.typeId === 'metadevice.device')
                .map(this.mapDeviceResponseToModel.bind(this))
                .filter(d => d !== undefined);
        }
        catch (ex) {
            this._platform.log.error('Failed to get devices for account.', ex.message);
            return [];
        }
    }
    mapDeviceResponseToModel(response) {
        const type = (0, device_type_1.getDeviceTypeForKey)(response.description.device.deviceClass);
        if (!type)
            return undefined;
        return {
            id: response.id,
            uuid: this._platform.api.hap.uuid.generate(response.id),
            deviceId: response.deviceId,
            name: response.friendlyName,
            type: type,
            manufacturer: response.description.device.manufacturerName,
            model: response.description.device.model.split(',').map(m => m.trim()),
            functions: this.getSupportedFunctionsFromResponse(response.description.functions)
        };
    }
    getSupportedFunctionsFromResponse(supportedFunctions) {
        const output = [];
        for (const df of device_functions_1.DeviceFunctions) {
            // Collected only supported Device Functions
            const type = supportedFunctions
                .find(fc => df.functionInstanceName === fc.functionInstance && df.functionClass === fc.functionClass);
            if (type === undefined || output.indexOf(type) >= 0)
                continue;
            output.push(type);
        }
        return output;
    }
}
exports.DiscoveryService = DiscoveryService;
//# sourceMappingURL=discovery.service.js.map