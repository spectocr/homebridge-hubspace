import { HubspacePlatform } from '../platform';
import { CharacteristicValue } from 'homebridge';
/**
 * Service for interacting with devices
 */
export declare class DeviceService {
    private readonly _platform;
    private readonly _httpClient;
    constructor(_platform: HubspacePlatform);
    /**
     * Sets an attribute value for a device
     * @param deviceId ID of a device
     * @param deviceFunction Function to set value for
     * @param value Value to set to attribute
     */
    setValue(deviceId: string, attributeId: string, value: CharacteristicValue): Promise<void>;
    /**
     * Gets a value for attribute
     * @param deviceId ID of a device
     * @param deviceFunction Function to get value for
     * @returns Data value
     */
    getValue(deviceId: string, attributeId: string): Promise<CharacteristicValue | undefined>;
    /**
     * Gets a value for attribute as boolean
     * @param deviceId ID of a device
     * @param deviceFunction Function to get value for
     * @returns Boolean value
     */
    getValueAsBoolean(deviceId: string, attributeId: string): Promise<boolean | undefined>;
    /**
     * Gets a single attribute with its value and last-updated timestamp
     * @param deviceId ID of a device
     * @param attributeId Attribute ID to fetch
     * @returns Attribute data including timestamp, or undefined if unavailable
     */
    getAttribute(deviceId: string, attributeId: string): Promise<{
        value: string;
        updatedTimestamp: number;
    } | undefined>;
    /**
     * Gets a value for attribute as integer
     * @param deviceId ID of a device
     * @param deviceFunction Function to get value for
     * @returns Integer value
     */
    getValueAsInteger(deviceId: string, attributeId: any): Promise<number | undefined>;
    private getDataValue;
    private handleError;
}
//# sourceMappingURL=device.service.d.ts.map