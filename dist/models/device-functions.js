"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceFunctionDef = exports.DeviceFunctions = exports.DeviceFunction = void 0;
/**
 * Device functions types
 */
var DeviceFunction;
(function (DeviceFunction) {
    DeviceFunction["Power"] = "power";
    DeviceFunction["Brightness"] = "brightness";
    DeviceFunction["FanLightPower"] = "light-power";
    DeviceFunction["FanPower"] = "fan-power";
    DeviceFunction["FanSpeed"] = "fan-speed";
    DeviceFunction["OutletPower"] = "power";
    DeviceFunction["LightTemperature"] = "color-temperature";
    DeviceFunction["LightColor"] = "color-rgb";
    DeviceFunction["ColorMode"] = "color-mode";
    // Value Functions
    DeviceFunction["Toggle"] = "toggle";
    DeviceFunction["MaxOnTime"] = "max-on-time";
    DeviceFunction["BatteryLevel"] = "battery-level";
    DeviceFunction["Timer"] = "timer";
    DeviceFunction["Spigot1"] = "spigot-1";
    DeviceFunction["Spigot2"] = "spigot-2";
})(DeviceFunction = exports.DeviceFunction || (exports.DeviceFunction = {}));
/**
 * Supported/implemented device functions
 * with identifiers for discovery and/or manipulation.
 */
exports.DeviceFunctions = [
    {
        functionClass: DeviceFunction.Power,
        functionInstanceName: DeviceFunction.FanLightPower
    },
    {
        functionClass: DeviceFunction.Power,
        functionInstanceName: DeviceFunction.FanPower
    },
    {
        functionClass: DeviceFunction.FanSpeed,
        functionInstanceName: DeviceFunction.FanSpeed
    },
    {
        functionClass: DeviceFunction.Power
    },
    {
        functionClass: DeviceFunction.Brightness
    },
    {
        functionClass: DeviceFunction.OutletPower
    },
    {
        functionClass: DeviceFunction.LightTemperature
    },
    {
        functionClass: DeviceFunction.LightColor
    },
    // This is to switch between Temperature (val:0) and Color (val:1) Light Modes, as Homekit sees these as mutually
    // exclusive, the value should always be Color (val:1) when being controlled by Homekit, otherwise 'undefined' will
    // be returned when reading the current color setting
    {
        functionClass: DeviceFunction.ColorMode
    },
    {
        functionClass: DeviceFunction.BatteryLevel
    },
    {
        functionClass: DeviceFunction.Toggle,
        functionInstanceName: DeviceFunction.Spigot1
    },
    {
        functionClass: DeviceFunction.MaxOnTime,
        functionInstanceName: DeviceFunction.Spigot1
    },
    {
        functionClass: DeviceFunction.Timer,
        functionInstanceName: DeviceFunction.Spigot1
    },
    {
        functionClass: DeviceFunction.Toggle,
        functionInstanceName: DeviceFunction.Spigot2
    },
    {
        functionClass: DeviceFunction.MaxOnTime,
        functionInstanceName: DeviceFunction.Spigot2
    },
    {
        functionClass: DeviceFunction.Timer,
        functionInstanceName: DeviceFunction.Spigot2
    }
];
/**
 * Gets function definition for a type
 * @param deviceFunction Function type
 * @returns Function definition for type
 * @throws {@link Error} when a type has no definition associated with it
 */
function getDeviceFunctionDef(deviceFunctionResponse, deviceFunction, deviceFunctionInstance) {
    const fc = deviceFunctionResponse.find(fc => fc.functionClass === deviceFunction &&
        (deviceFunctionInstance ? fc.functionInstance === deviceFunctionInstance : true));
    // Throw an error when not found - function definition must be set during development,
    // otherwise the plugin will not work as expected.
    if (!fc) {
        throw new Error(`Failed to get function definition for '${deviceFunction}'. Each function requires to set a definition.`);
    }
    return fc;
}
exports.getDeviceFunctionDef = getDeviceFunctionDef;
//# sourceMappingURL=device-functions.js.map