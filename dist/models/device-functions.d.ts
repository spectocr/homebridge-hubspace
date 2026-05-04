import { DeviceFunctionDef } from './device-function-def';
import { DeviceFunctionResponse } from '../responses/device-function-response';
/**
 * Device functions types
 */
export declare enum DeviceFunction {
    Power = "power",
    Brightness = "brightness",
    FanLightPower = "light-power",
    FanPower = "fan-power",
    FanSpeed = "fan-speed",
    OutletPower = "power",
    LightTemperature = "color-temperature",
    LightColor = "color-rgb",
    ColorMode = "color-mode",
    Toggle = "toggle",
    MaxOnTime = "max-on-time",
    BatteryLevel = "battery-level",
    Timer = "timer",
    Spigot1 = "spigot-1",
    Spigot2 = "spigot-2"
}
/**
 * Supported/implemented device functions
 * with identifiers for discovery and/or manipulation.
 */
export declare const DeviceFunctions: DeviceFunctionDef[];
/**
 * Gets function definition for a type
 * @param deviceFunction Function type
 * @returns Function definition for type
 * @throws {@link Error} when a type has no definition associated with it
 */
export declare function getDeviceFunctionDef(deviceFunctionResponse: DeviceFunctionResponse[], deviceFunction: DeviceFunction, deviceFunctionInstance?: DeviceFunction): DeviceFunctionResponse;
//# sourceMappingURL=device-functions.d.ts.map