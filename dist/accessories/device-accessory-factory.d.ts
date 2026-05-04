import { PlatformAccessory } from 'homebridge';
import { Device } from '../models/device';
import { HubspacePlatform } from '../platform';
import { HubspaceAccessory } from './hubspace-accessory';
/**
 * Creates {@link HubspaceAccessory} for a specific {@link DeviceType}
 * @param device Device information
 * @param platform Hubspace platform
 * @param accessory Platform accessory
 * @returns {@link HubspaceAccessory}
 * @throws If device type is not supported
 */
export declare function createAccessoryForDevice(device: Device, platform: HubspacePlatform, accessory: PlatformAccessory): HubspaceAccessory;
//# sourceMappingURL=device-accessory-factory.d.ts.map