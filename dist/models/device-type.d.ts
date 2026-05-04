/**
 * Type of a device
 */
export declare enum DeviceType {
    Light = "light",
    Fan = "fan",
    Outlet = "power-outlet",
    Sprinkler = "sprinkler"
}
/**
 * Gets {@link DeviceType} for a specific key
 * @param key Device key
 * @returns {@link DeviceType} if key is found otherwise undefined
 */
export declare function getDeviceTypeForKey(key: string): DeviceType | undefined;
//# sourceMappingURL=device-type.d.ts.map