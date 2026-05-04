"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SprinklerAccessory = void 0;
const device_functions_1 = require("../models/device-functions");
const utils_1 = require("../utils");
const hubspace_accessory_1 = require("./hubspace-accessory");
class SprinklerAccessory extends hubspace_accessory_1.HubspaceAccessory {
    /**
     * Crates a new instance of the accessory
     * @param platform Hubspace platform
     * @param accessory Platform accessory
     */
    constructor(platform, accessory) {
        super(platform, accessory, [new platform.Service.Valve('1', '1'), new platform.Service.Valve('2', '2'), platform.Service.Battery]);
        this.configureSprinkler();
        this.removeStaleServices();
    }
    configureSprinkler() {
        this.configureName(this.services[0], this.accessory.displayName + ' 1');
        this.configureName(this.services[1], this.accessory.displayName + ' 2');
        if (this.supportsFunction(device_functions_1.DeviceFunction.Toggle)) {
            this.services[0].getCharacteristic(this.platform.Characteristic.Active)
                .onGet(() => this.getActive(device_functions_1.DeviceFunction.Spigot1))
                .onSet((value) => this.setActive(device_functions_1.DeviceFunction.Spigot1, value));
            this.services[0].getCharacteristic(this.platform.Characteristic.InUse)
                .onGet(() => this.getInUse(device_functions_1.DeviceFunction.Spigot1));
            this.services[0].getCharacteristic(this.platform.Characteristic.ValveType)
                .onGet(() => this.platform.api.hap.Characteristic.ValveType.IRRIGATION);
            this.services[1].getCharacteristic(this.platform.Characteristic.Active)
                .onGet(() => this.getActive(device_functions_1.DeviceFunction.Spigot2))
                .onSet((value) => this.setActive(device_functions_1.DeviceFunction.Spigot2, value));
            this.services[1].getCharacteristic(this.platform.Characteristic.InUse)
                .onGet(() => this.getInUse(device_functions_1.DeviceFunction.Spigot2));
            this.services[1].getCharacteristic(this.platform.Characteristic.ValveType)
                .onGet(() => this.platform.api.hap.Characteristic.ValveType.IRRIGATION);
        }
        if (this.supportsFunction(device_functions_1.DeviceFunction.Timer)) {
            this.services[0].getCharacteristic(this.platform.Characteristic.RemainingDuration)
                .onGet(() => this.getRemainingDuration(device_functions_1.DeviceFunction.Spigot1));
            this.services[0].getCharacteristic(this.platform.Characteristic.SetDuration)
                .onGet(() => this.getMaxDuration(device_functions_1.DeviceFunction.Spigot1))
                .onSet((value) => this.setMaxDuration(device_functions_1.DeviceFunction.Spigot1, value));
            this.services[1].getCharacteristic(this.platform.Characteristic.RemainingDuration)
                .onGet(() => this.getRemainingDuration(device_functions_1.DeviceFunction.Spigot2));
            this.services[1].getCharacteristic(this.platform.Characteristic.SetDuration)
                .onGet(() => this.getMaxDuration(device_functions_1.DeviceFunction.Spigot2))
                .onSet((value) => this.setMaxDuration(device_functions_1.DeviceFunction.Spigot2, value));
        }
        if (this.supportsFunction(device_functions_1.DeviceFunction.BatteryLevel)) {
            this.services[2].getCharacteristic(this.platform.Characteristic.StatusLowBattery)
                .onGet(this.getStatusLowBattery.bind(this));
            this.services[2].getCharacteristic(this.platform.Characteristic.BatteryLevel)
                .onGet(this.getBatteryLevel.bind(this));
        }
    }
    async getActive(functionType) {
        // Try to get the value
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.Toggle, functionType);
        const value = await this.deviceService.getValueAsBoolean(this.device.deviceId, func.values[0].deviceValues[0].key);
        // If the value is not defined then show 'Not Responding'
        if ((0, utils_1.isNullOrUndefined)(value)) {
            throw new this.platform.api.hap.HapStatusError(-70402 /* this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE */);
        }
        this.log.debug(`${this.device.name}: Triggered GET Active: ${value}`);
        // Otherwise return the value
        return value ? this.platform.api.hap.Characteristic.Active.ACTIVE : this.platform.api.hap.Characteristic.Active.INACTIVE;
    }
    async setActive(functionType, value) {
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.Toggle, functionType);
        this.log.debug(`${this.device.name}: Triggered SET Active: ${value}`);
        await this.deviceService.setValue(this.device.deviceId, func.values[0].deviceValues[0].key, value);
        if (functionType === device_functions_1.DeviceFunction.Spigot1) {
            this.services[0].updateCharacteristic(this.platform.Characteristic.InUse, value);
            this.services[0].updateCharacteristic(this.platform.Characteristic.Active, value);
            if (value === this.platform.api.hap.Characteristic.Active.INACTIVE) {
                this.services[0].updateCharacteristic(this.platform.Characteristic.RemainingDuration, 0);
            }
            else {
                /* TODO: figure out how to query this */
                this.services[0].updateCharacteristic(this.platform.Characteristic.RemainingDuration, await this.getMaxDuration(functionType));
            }
        }
        else if (functionType === device_functions_1.DeviceFunction.Spigot2) {
            this.services[1].updateCharacteristic(this.platform.Characteristic.InUse, value);
            this.services[1].updateCharacteristic(this.platform.Characteristic.Active, value);
            if (value === this.platform.api.hap.Characteristic.Active.INACTIVE) {
                this.services[1].updateCharacteristic(this.platform.Characteristic.RemainingDuration, 0);
            }
            else {
                /* TODO: figure out how to query this */
                this.services[1].updateCharacteristic(this.platform.Characteristic.RemainingDuration, await this.getMaxDuration(functionType));
            }
        }
    }
    async getInUse(functionType) {
        // Try to get the value
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.Toggle, functionType);
        const value = await this.deviceService.getValueAsBoolean(this.device.deviceId, func.values[0].deviceValues[0].key);
        // If the value is not defined then show 'Not Responding'
        if ((0, utils_1.isNullOrUndefined)(value)) {
            throw new this.platform.api.hap.HapStatusError(-70402 /* this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE */);
        }
        this.log.debug(`${this.device.name}: Triggered GET InUse: ${value}`);
        // Otherwise return the value
        return value ? this.platform.api.hap.Characteristic.InUse.IN_USE : this.platform.api.hap.Characteristic.InUse.NOT_IN_USE;
    }
    async getRemainingDuration(functionType) {
        // Remaining time is computed from the toggle attribute's updatedTimestamp.
        // The Afero API's 'timer' attribute does not update in real-time; instead we track
        // how long ago the valve was opened and subtract from the configured max-on-time.
        const toggleFunc = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.Toggle, functionType);
        const toggleAttr = await this.deviceService.getAttribute(this.device.deviceId, toggleFunc.values[0].deviceValues[0].key);
        if ((0, utils_1.isNullOrUndefined)(toggleAttr)) {
            throw new this.platform.api.hap.HapStatusError(-70402 /* this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE */);
        }
        // Valve is off — no time remaining
        if (toggleAttr.value !== '1')
            return 0;
        const maxSeconds = await this.getMaxDuration(functionType);
        const elapsed = (Date.now() - toggleAttr.updatedTimestamp) / 1000;
        const remaining = Math.min(Math.max(0, Math.round(maxSeconds - elapsed)), 3600);
        this.log.debug(`${this.device.name}: Triggered GET Remaining Duration: ${remaining}s`);
        return remaining;
    }
    async setMaxDuration(functionType, value) {
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.MaxOnTime, functionType);
        this.log.debug(`${this.device.name}: Triggered SET Max Duration: ${value}`);
        const minutes = value / 60;
        await this.deviceService.setValue(this.device.deviceId, func.values[0].deviceValues[0].key, minutes);
    }
    async getMaxDuration(functionType) {
        // Try to get the value
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.MaxOnTime, functionType);
        const value = await this.deviceService.getValueAsInteger(this.device.deviceId, func.values[0].deviceValues[0].key);
        // If the value is not defined then show 'Not Responding'
        if ((0, utils_1.isNullOrUndefined)(value)) {
            throw new this.platform.api.hap.HapStatusError(-70402 /* this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE */);
        }
        this.log.debug(`${this.device.name}: Triggered GET Max Duration: ${value}`);
        let seconds = value * 60;
        if (seconds > 3600) {
            seconds = 3600;
        }
        // Otherwise return the value
        return seconds;
    }
    async getStatusLowBattery() {
        // Try to get the value
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.BatteryLevel);
        const value = await this.deviceService.getValueAsInteger(this.device.deviceId, func.values[0].deviceValues[0].key);
        // If the value is not defined then show 'Not Responding'
        if ((0, utils_1.isNullOrUndefined)(value)) {
            throw new this.platform.api.hap.HapStatusError(-70402 /* this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE */);
        }
        let ret;
        if (value <= 20) {
            ret = this.platform.api.hap.Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW;
        }
        else {
            ret = this.platform.api.hap.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
        }
        this.log.debug(`${this.device.name}: Triggered GET Battery Level: ${ret}`);
        return ret;
    }
    async getBatteryLevel() {
        // Try to get the value
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.BatteryLevel);
        const value = await this.deviceService.getValueAsInteger(this.device.deviceId, func.values[0].deviceValues[0].key);
        // If the value is not defined then show 'Not Responding'
        if ((0, utils_1.isNullOrUndefined)(value)) {
            throw new this.platform.api.hap.HapStatusError(-70402 /* this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE */);
        }
        this.log.debug(`${this.device.name}: Triggered GET Battery Level: ${value}`);
        // Otherwise return the value
        return value;
    }
}
exports.SprinklerAccessory = SprinklerAccessory;
//# sourceMappingURL=sprinkler-accessory.js.map