import { PlatformAccessory } from 'homebridge';
import { HubspacePlatform } from '../platform';
import { HubspaceAccessory } from './hubspace-accessory';
export declare class SprinklerAccessory extends HubspaceAccessory {
    /**
     * Crates a new instance of the accessory
     * @param platform Hubspace platform
     * @param accessory Platform accessory
     */
    constructor(platform: HubspacePlatform, accessory: PlatformAccessory);
    private configureSprinkler;
    private getActive;
    private setActive;
    private getInUse;
    private getRemainingDuration;
    private setMaxDuration;
    private getMaxDuration;
    private getStatusLowBattery;
    private getBatteryLevel;
}
//# sourceMappingURL=sprinkler-accessory.d.ts.map