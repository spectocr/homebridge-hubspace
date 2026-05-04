"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubspaceAccessory = void 0;
/**
 * Base class for Hubspace accessories
 */
class HubspaceAccessory {
    /**
     * Crates new instance of {@link HubspaceAccessory}
     * @param platform Hubspace platform
     * @param accessory Platform accessory
     * @param service Service type for accessory
     */
    constructor(platform, accessory, services) {
        var _a, _b;
        this.platform = platform;
        this.accessory = accessory;
        /**
         * Accessory services
         */
        this.services = [];
        for (const service of services) {
            const initializedService = accessory.getServiceById(service.displayName, service.subtype) ||
                accessory.getService(service) ||
                this.accessory.addService(service);
            this.services.push(initializedService);
        }
        this.config = platform.config;
        this.log = platform.log;
        this.deviceService = platform.deviceService;
        this.device = accessory.context.device;
        this.accessory.getService(this.platform.Service.AccessoryInformation)
            .setCharacteristic(this.platform.Characteristic.Manufacturer, (_a = this.device.manufacturer) !== null && _a !== void 0 ? _a : 'N/A')
            .setCharacteristic(this.platform.Characteristic.Model, this.device.model.length > 0 ? this.device.model[0] : 'N/A')
            .setCharacteristic(this.platform.Characteristic.SerialNumber, (_b = this.device.deviceId) !== null && _b !== void 0 ? _b : 'N/A');
    }
    /**
     * Checks whether function is supported by device
     * @param deviceFunction Function to check
     * @returns True if function is supported by the device otherwise false
     */
    supportsFunction(deviceFunction) {
        return this.device.functions.some(fc => fc.functionClass === deviceFunction);
    }
    removeStaleServices() {
        /* slice out the accessory service */
        const staleServices = this.accessory.services.slice(1).filter(a => !this.services.some(d => d.UUID === a.UUID && a.displayName === d.displayName));
        for (const staleService of staleServices) {
            this.accessory.removeService(staleService);
        }
    }
    configureName(service, name) {
        service.setCharacteristic(this.platform.Characteristic.Name, name);
        service.setCharacteristic(this.platform.Characteristic.ConfiguredName, name);
    }
}
exports.HubspaceAccessory = HubspaceAccessory;
//# sourceMappingURL=hubspace-accessory.js.map