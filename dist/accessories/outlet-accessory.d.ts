import { PlatformAccessory } from 'homebridge';
import { HubspacePlatform } from '../platform';
import { HubspaceAccessory } from './hubspace-accessory';
export declare class OutletAccessory extends HubspaceAccessory {
    /**
     * Crates a new instance of the accessory
     * @param platform Hubspace platform
     * @param accessory Platform accessory
     */
    constructor(platform: HubspacePlatform, accessory: PlatformAccessory);
    private configurePower;
    private getOn;
    private setOn;
}
//# sourceMappingURL=outlet-accessory.d.ts.map