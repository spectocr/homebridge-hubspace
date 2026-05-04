"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutletAccessory = void 0;
const device_functions_1 = require("../models/device-functions");
const utils_1 = require("../utils");
const hubspace_accessory_1 = require("./hubspace-accessory");
class OutletAccessory extends hubspace_accessory_1.HubspaceAccessory {
    /**
     * Crates a new instance of the accessory
     * @param platform Hubspace platform
     * @param accessory Platform accessory
     */
    constructor(platform, accessory) {
        super(platform, accessory, [platform.Service.Outlet]);
        this.configurePower();
        this.removeStaleServices();
    }
    configurePower() {
        if (this.supportsFunction(device_functions_1.DeviceFunction.OutletPower)) {
            this.services[0].getCharacteristic(this.platform.Characteristic.On)
                .onGet(this.getOn.bind(this))
                .onSet(this.setOn.bind(this));
        }
    }
    async getOn() {
        // Try to get the value
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.OutletPower);
        const value = await this.deviceService.getValueAsBoolean(this.device.deviceId, func.values[0].deviceValues[0].key);
        // If the value is not defined then show 'Not Responding'
        if ((0, utils_1.isNullOrUndefined)(value)) {
            throw new this.platform.api.hap.HapStatusError(-70402 /* this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE */);
        }
        // Otherwise return the value
        return value;
    }
    async setOn(value) {
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.OutletPower);
        await this.deviceService.setValue(this.device.deviceId, func.values[0].deviceValues[0].key, value);
    }
}
exports.OutletAccessory = OutletAccessory;
//# sourceMappingURL=outlet-accessory.js.map