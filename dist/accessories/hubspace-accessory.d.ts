import { PlatformConfig, Logger, PlatformAccessory, Service, WithUUID } from 'homebridge';
import { Device } from '../models/device';
import { DeviceFunction } from '../models/device-functions';
import { HubspacePlatform } from '../platform';
import { DeviceService } from '../services/device.service';
/**
 * Base class for Hubspace accessories
 */
export declare abstract class HubspaceAccessory {
    protected readonly platform: HubspacePlatform;
    protected readonly accessory: PlatformAccessory;
    /**
     * Accessory services
     */
    protected readonly services: Service[];
    /**
     * Application logger
     */
    protected readonly log: Logger;
    /**
     * Application config
     */
    protected readonly config: PlatformConfig;
    /**
     * Device interaction service
     */
    protected readonly deviceService: DeviceService;
    /**
     * Device information
     */
    protected readonly device: Device;
    /**
     * Crates new instance of {@link HubspaceAccessory}
     * @param platform Hubspace platform
     * @param accessory Platform accessory
     * @param service Service type for accessory
     */
    constructor(platform: HubspacePlatform, accessory: PlatformAccessory, services: (Service | WithUUID<typeof Service>)[]);
    /**
     * Checks whether function is supported by device
     * @param deviceFunction Function to check
     * @returns True if function is supported by the device otherwise false
     */
    protected supportsFunction(deviceFunction: DeviceFunction): boolean;
    protected removeStaleServices(): void;
    protected configureName(service: Service, name: string): void;
}
//# sourceMappingURL=hubspace-accessory.d.ts.map