"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanAccessory = void 0;
const hubspace_accessory_1 = require("./hubspace-accessory");
const utils_1 = require("../utils");
const device_functions_1 = require("../models/device-functions");
/**
 * Fan accessory for Hubspace platform
 */
class FanAccessory extends hubspace_accessory_1.HubspaceAccessory {
    /**
     * Crates a new instance of the accessory
     * @param platform Hubspace platform
     * @param accessory Platform accessory
     */
    constructor(platform, accessory) {
        super(platform, accessory, [platform.Service.Fanv2]);
        this.configureActive();
        this.configureRotationSpeed();
        this.removeStaleServices();
    }
    configureActive() {
        this.services[0].getCharacteristic(this.platform.Characteristic.Active)
            .onGet(this.getActive.bind(this))
            .onSet(this.setActive.bind(this));
    }
    configureRotationSpeed() {
        this.services[0].getCharacteristic(this.platform.Characteristic.RotationSpeed)
            .onGet(this.getRotationSpeed.bind(this))
            .onSet(this.setRotationSpeed.bind(this))
            .setProps({
            minValue: 0,
            maxValue: 100,
            minStep: 25
        });
    }
    async setActive(value) {
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.Power, device_functions_1.DeviceFunction.FanPower);
        await this.deviceService.setValue(this.device.deviceId, func.values[0].deviceValues[0].key, value);
    }
    async getActive() {
        // Try to get the value
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.Power, device_functions_1.DeviceFunction.FanPower);
        const value = await this.deviceService.getValue(this.device.deviceId, func.values[0].deviceValues[0].key);
        // If the value is not defined then show 'Not Responding'
        if ((0, utils_1.isNullOrUndefined)(value)) {
            throw new this.platform.api.hap.HapStatusError(-70402 /* this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE */);
        }
        // Otherwise return the value
        return value;
    }
    async getRotationSpeed() {
        // Try to get the value
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.FanSpeed);
        const value = await this.deviceService.getValue(this.device.deviceId, func.values[0].deviceValues[0].key);
        // If the value is not defined then show 'Not Responding'
        if ((0, utils_1.isNullOrUndefined)(value)) {
            throw new this.platform.api.hap.HapStatusError(-70402 /* this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE */);
        }
        // Otherwise return the value
        return value;
    }
    async setRotationSpeed(value) {
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.FanSpeed);
        await this.deviceService.setValue(this.device.deviceId, func.values[0].deviceValues[0].key, value);
    }
}
exports.FanAccessory = FanAccessory;
//# sourceMappingURL=fan-accessory.js.map