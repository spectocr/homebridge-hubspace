"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightAccessory = void 0;
const hubspace_accessory_1 = require("./hubspace-accessory");
const utils_1 = require("../utils");
const device_functions_1 = require("../models/device-functions");
/**
 * Light accessory for Hubspace platform
 */
class LightAccessory extends hubspace_accessory_1.HubspaceAccessory {
    /**
     * Crates a new instance of the accessory
     * @param platform Hubspace platform
     * @param accessory Platform accessory
     * @param rgbColorSpace The "Forced" Color Space of the Accessory
     */
    constructor(platform, accessory) {
        super(platform, accessory, [new platform.Service.Lightbulb('1', '1')]);
        /**
         * Hue and Saturation work odd in Homekit. As Hubspace works in RGB color space with one item, Hue and Saturation
         * can come over in any order from Homekit. So we need to keep track of who is sent first and update once the other
         * comes over.
         */
        this.hue = -1;
        this.saturation = -1;
        this.configurePower(0);
        this.configureBrightness(0);
        this.configureName(this.services[0], this.accessory.displayName);
        // * If [Color Temperature] characteristic is included in the `Light Bulb`, `Hue` and `Saturation` must not be included as optional
        // * characteristics in `Light Bulb`. This characteristic must not be used for lamps which support color.
        if (this.configureColor(0) && this.config.dualColorSpace) {
            // TODO: move this to a common place...
            const service = new platform.Service.Lightbulb('2', '2');
            const initializedService = accessory.getServiceById(service.displayName, service.subtype) ||
                this.accessory.addService(service);
            this.services.push(initializedService);
            this.configureName(this.services[1], this.accessory.displayName + ' Temperature');
            this.configurePower(1);
            this.configureBrightness(1);
            this.configureTemperature(1);
        }
        else {
            this.configureTemperature(0);
        }
        this.removeStaleServices();
    }
    configurePower(i) {
        this.services[i].getCharacteristic(this.platform.Characteristic.On)
            .onGet(() => this.getOn(i))
            .onSet((value) => this.setOn(i, value));
    }
    configureBrightness(i) {
        if (!this.supportsFunction(device_functions_1.DeviceFunction.Brightness))
            return;
        this.services[i].getCharacteristic(this.platform.Characteristic.Brightness)
            .onGet(() => this.getBrightness(i))
            .onSet((value) => this.setBrightness(i, value));
    }
    configureTemperature(i) {
        if (!this.supportsFunction(device_functions_1.DeviceFunction.LightTemperature))
            return;
        this.services[i].getCharacteristic(this.platform.Characteristic.ColorTemperature)
            .onGet(() => this.getTemperature(i))
            .onSet((value) => this.setTemperature(i, value));
    }
    configureColor(i) {
        if (!this.supportsFunction(device_functions_1.DeviceFunction.LightColor))
            return false;
        this.services[i].getCharacteristic(this.platform.Characteristic.Hue)
            .onGet(() => this.getHue(i))
            .onSet((value) => this.setHue(i, value));
        this.services[i].getCharacteristic(this.platform.Characteristic.Saturation)
            .onGet(() => this.getSaturation(i))
            .onSet((value) => this.setSaturation(i, value));
        return true;
    }
    async getOn(i) {
        // Try to get the value
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.Power);
        const value = await this.deviceService.getValueAsBoolean(this.device.deviceId, func.values[0].deviceValues[0].key);
        // If the value is not defined then show 'Not Responding'
        if ((0, utils_1.isNullOrUndefined)(value)) {
            throw new this.platform.api.hap.HapStatusError(-70402 /* this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE */);
        }
        this.log.debug(`${this.device.name}: Received ${value} from Hubspace Power`);
        // Otherwise return the value
        return value;
    }
    async setOn(i, value) {
        this.log.debug(`${this.device.name}: Received ${value} from Homekit Power`);
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.Power);
        await this.deviceService.setValue(this.device.deviceId, func.values[0].deviceValues[0].key, value);
        /* update the other 'virtual' bulb */
        const service_idx = i === 1 ? 0 : 1;
        if (this.services[service_idx]) {
            this.services[service_idx].updateCharacteristic(this.platform.Characteristic.On, value);
        }
    }
    async getBrightness(i) {
        // Try to get the value
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.Brightness);
        const value = await this.deviceService.getValueAsInteger(this.device.deviceId, func.values[0].deviceValues[0].key);
        this.throwErrorIfNullOrUndefinedInt(value, 'Received Comm Failure for get Brightness');
        this.log.debug(`${this.device.name}: Received ${value} from Hubspace Brightness`);
        // Otherwise return the value
        return value;
    }
    async setBrightness(i, value) {
        // Homekit can send a 0 value for brightness when sliding to off, which is not valid for Hubspace
        if (value === 0) {
            // TODO: should be call power off?
            this.log.debug(`${this.device.name}: Received 0 from Homekit Brightness, ignoring as 0 is not valid for Hubspace`);
        }
        else {
            this.log.debug(`${this.device.name}: Received ${value} from Homekit Brightness`);
            const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.Brightness);
            await this.deviceService.setValue(this.device.deviceId, func.values[0].deviceValues[0].key, value);
            /* update the other 'virtual' bulb */
            const service_idx = i === 1 ? 0 : 1;
            if (this.services[service_idx]) {
                this.services[service_idx].updateCharacteristic(this.platform.Characteristic.Brightness, value);
            }
        }
    }
    async getTemperature(i) {
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.ColorMode);
        const colorMode = await this.deviceService.getValueAsBoolean(this.device.deviceId, func.values[0].deviceValues[0].key);
        this.throwErrorIfNullOrUndefined(colorMode, 'Received Comm Failure for get Temperature');
        // Lightbulb is currently in the Temperature Color Space
        if (colorMode === false) {
            // Try to get the value
            const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.LightTemperature);
            const kelvin = await this.deviceService.getValueAsInteger(this.device.deviceId, func.values[0].deviceValues[0].key);
            this.throwErrorIfNullOrUndefinedInt(kelvin, 'Received Comm Failure for get Temperature');
            const value = (0, utils_1.normalizeValue)(kelvin, 6500, 2200, 140, 500, 1);
            this.log.debug(`${this.device.name}: Received ${kelvin} from Hubspace Color Temperature, sending ${value} to Homebridge`);
            // Otherwise return the value
            return value;
        }
        // Lightbulb is currently in the RGB Color Space
        else {
            const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.LightColor);
            const rgb = await this.deviceService.getValue(this.device.deviceId, func.values[0].deviceValues[0].key);
            this.throwErrorIfNullOrUndefined(rgb, 'Received Comm Failure for get Temperature');
            const mired = (0, utils_1.clamp)((0, utils_1.rgbToMired)((0, utils_1.hexToRgb)(rgb)), 140, 500);
            this.log.debug(`${this.device.name}: Received ${rgb} from Hubspace Color Temperature, sending ${Math.round(mired)} to Homebridge`);
            // Try to give it something reasonable to display
            return Math.round(mired);
        }
    }
    async setTemperature(i, value) {
        this.setColorMode(0);
        // HomeKit Sends values with a min of 140 and a max of 500 with a step of 1
        // and Hubbridge expects values of a different scale such as 2200K to 6500K
        // with a step of 100
        const kelvin = (0, utils_1.normalizeValue)(value, 140, 500, 6500, 2200, 100);
        this.log.debug(`${this.device.name}: Received ${value} from Homekit Color Temperature, sending ${kelvin}K to Hubridge`);
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.LightTemperature);
        this.deviceService.setValue(this.device.deviceId, func.values[0].deviceValues[0].key, kelvin);
    }
    async getHue(i) {
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.ColorMode);
        const colorMode = await this.deviceService.getValueAsBoolean(this.device.deviceId, func.values[0].deviceValues[0].key);
        this.throwErrorIfNullOrUndefined(colorMode, 'Received Comm Failure for get Hue');
        let r, g, b;
        // Lightbulb is currently in the RGB Color Space
        if (colorMode === true) {
            // Try to get the value
            const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.LightColor);
            const rgb = await this.deviceService.getValue(this.device.deviceId, func.values[0].deviceValues[0].key);
            this.throwErrorIfNullOrUndefinedInt(rgb, 'Received Comm Failure for get Hue');
            [r, g, b] = (0, utils_1.hexToRgb)(rgb);
        }
        // Lightbulb is currently in the Temperature Color Space
        else {
            const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.LightTemperature);
            const kelvin = await this.deviceService.getValue(this.device.deviceId, func.values[0].deviceValues[0].key);
            this.throwErrorIfNullOrUndefinedInt(kelvin, 'Received Comm Failure for get Temperature');
            [r, g, b] = (0, utils_1.kelvinToRgb)(kelvin);
        }
        const [h, s, v] = (0, utils_1.rgbToHsv)(r, g, b);
        this.log.debug(`${this.device.name}: sending ${Math.round(h)} to Homebridge for Hue`);
        // Otherwise return the value
        return Math.round(h);
    }
    async setHue(i, value) {
        this.setColorMode(1);
        // Both values are unknown, so set Hue and expect Saturation to send it over once that is received
        if (this.hue === -1 && this.saturation === -1) {
            this.hue = value;
            this.log.debug(`${this.device.name}: Received ${value} from Homekit Hue, waiting for Saturation`);
            return;
        }
        // Saturation has already been sent over, it's now Hue job to send over the RGB value with the saturation value
        else if (this.hue === -1 && this.saturation !== -1) {
            const [r, g, b] = (0, utils_1.hsvToRgb)(value, this.saturation, 100);
            // Set Saturation back to unknown
            this.saturation = -1;
            const hexRgb = (0, utils_1.rgbToHex)(r, g, b);
            this.log.debug(`${this.device.name}: Received ${value} from Homekit Hue, sending ${hexRgb} from to Hubspace Color RGB`);
            const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.LightColor);
            this.deviceService.setValue(this.device.deviceId, func.values[0].deviceValues[0].key, hexRgb);
        }
        else {
            this.hue = value;
            this.log.warn(`${this.device.name}: Received another ${value} from Homekit Hue, but cannot send without a Saturation value`);
        }
    }
    async getSaturation(i) {
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.ColorMode);
        const colorMode = await this.deviceService.getValueAsBoolean(this.device.deviceId, func.values[0].deviceValues[0].key);
        this.throwErrorIfNullOrUndefined(colorMode, 'Received Comm Failure for get Hue');
        let r, g, b;
        // Lightbulb is currently in the RGB Color Space
        if (colorMode === true) {
            // Try to get the value
            const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.LightColor);
            const rgb = await this.deviceService.getValue(this.device.deviceId, func.values[0].deviceValues[0].key);
            this.throwErrorIfNullOrUndefinedInt(rgb, 'Received Comm Failure for get Hue');
            [r, g, b] = (0, utils_1.hexToRgb)(rgb);
        }
        // Lightbulb is currently in the Temperature Color Space
        else {
            const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.LightTemperature);
            const kelvin = await this.deviceService.getValue(this.device.deviceId, func.values[0].deviceValues[0].key);
            this.throwErrorIfNullOrUndefinedInt(kelvin, 'Received Comm Failure for get Temperature');
            [r, g, b] = (0, utils_1.kelvinToRgb)(kelvin);
        }
        const [h, s, v] = (0, utils_1.rgbToHsv)(r, g, b);
        this.log.debug(`${this.device.name}: sending ${Math.round(s)} to Homebridge for Saturation`);
        // Otherwise return the value
        return Math.round(s);
    }
    async setSaturation(i, value) {
        this.setColorMode(1);
        // Both values are unknown, so set Saturation and expect Hue to send it over once that is received
        if (this.hue === -1 && this.saturation === -1) {
            this.saturation = value;
            this.log.debug(`${this.device.name}: Received ${value} from Homekit Saturation, waiting for Hue`);
            return;
        }
        // Saturation has already been sent over, it's now Hue job to send over the RGB value with the saturation value
        else if (this.hue !== -1 && this.saturation === -1) {
            const [r, g, b] = (0, utils_1.hsvToRgb)(this.hue, value, 100);
            // Set hue back to unknown
            this.hue = -1;
            const hexRgb = (0, utils_1.rgbToHex)(r, g, b);
            this.log.debug(`${this.device.name}: Received ${value} from Homekit Saturation, sending ${hexRgb} from to Hubspace Color RGB`);
            const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.LightColor);
            this.deviceService.setValue(this.device.deviceId, func.values[0].deviceValues[0].key, hexRgb);
        }
        else {
            this.saturation = value;
            this.log.warn(`${this.device.name}: Received another ${value} from Homekit Saturation, but cannot send without a Hue value`);
        }
    }
    setColorMode(value) {
        // Color Mode is a boolean value used to switch between temperature and color modes, 1 is for Color RGB Mode and 0 is for
        // Color Temperature Mode. It is possible for a user to change it back in to Color Temperature Mode using the Hubspace app
        // but homekit should only be working in color RGB mode if the lightbulb supports color.
        const func = (0, device_functions_1.getDeviceFunctionDef)(this.device.functions, device_functions_1.DeviceFunction.ColorMode);
        this.deviceService.setValue(this.device.deviceId, func.values[0].deviceValues[0].key, value);
    }
    throwErrorIfNullOrUndefined(value, message) {
        if ((0, utils_1.isNullOrUndefined)(value)) {
            this.log.error(`${this.device.name}: ${message}`);
            throw new this.platform.api.hap.HapStatusError(-70402 /* this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE */);
        }
    }
    throwErrorIfNullOrUndefinedInt(value, message) {
        if ((0, utils_1.isNullOrUndefined)(value) || value === -1) {
            this.log.error(`${this.device.name}: ${message}`);
            throw new this.platform.api.hap.HapStatusError(-70402 /* this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE */);
        }
    }
}
exports.LightAccessory = LightAccessory;
//# sourceMappingURL=light-accessory.js.map