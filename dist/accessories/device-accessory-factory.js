"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccessoryForDevice = void 0;
const device_type_1 = require("../models/device-type");
const fan_accessory_1 = require("./fan-accessory");
const light_accessory_1 = require("./light-accessory");
const outlet_accessory_1 = require("./outlet-accessory");
const sprinkler_accessory_1 = require("./sprinkler-accessory");
/**
 * Creates {@link HubspaceAccessory} for a specific {@link DeviceType}
 * @param device Device information
 * @param platform Hubspace platform
 * @param accessory Platform accessory
 * @returns {@link HubspaceAccessory}
 * @throws If device type is not supported
 */
function createAccessoryForDevice(device, platform, accessory) {
    switch (device.type) {
        case device_type_1.DeviceType.Light:
            return new light_accessory_1.LightAccessory(platform, accessory);
        case device_type_1.DeviceType.Fan:
            return new fan_accessory_1.FanAccessory(platform, accessory);
        case device_type_1.DeviceType.Outlet:
            return new outlet_accessory_1.OutletAccessory(platform, accessory);
        case device_type_1.DeviceType.Sprinkler:
            return new sprinkler_accessory_1.SprinklerAccessory(platform, accessory);
        default:
            throw new Error(`Accessory of type '${device.type}' is not supported.`);
    }
}
exports.createAccessoryForDevice = createAccessoryForDevice;
//# sourceMappingURL=device-accessory-factory.js.map