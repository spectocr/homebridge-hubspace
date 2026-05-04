import { PlatformAccessory } from 'homebridge';
import { HubspacePlatform } from '../platform';
import { HubspaceAccessory } from './hubspace-accessory';
/**
 * Fan accessory for Hubspace platform
 */
export declare class FanAccessory extends HubspaceAccessory {
    /**
     * Crates a new instance of the accessory
     * @param platform Hubspace platform
     * @param accessory Platform accessory
     */
    constructor(platform: HubspacePlatform, accessory: PlatformAccessory);
    private configureActive;
    private configureRotationSpeed;
    private setActive;
    private getActive;
    private getRotationSpeed;
    private setRotationSpeed;
}
//# sourceMappingURL=fan-accessory.d.ts.map