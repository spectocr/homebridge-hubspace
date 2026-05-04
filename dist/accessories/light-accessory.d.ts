import { PlatformAccessory } from 'homebridge';
import { HubspacePlatform } from '../platform';
import { HubspaceAccessory } from './hubspace-accessory';
/**
 * Light accessory for Hubspace platform
 */
export declare class LightAccessory extends HubspaceAccessory {
    /**
     * Crates a new instance of the accessory
     * @param platform Hubspace platform
     * @param accessory Platform accessory
     * @param rgbColorSpace The "Forced" Color Space of the Accessory
     */
    constructor(platform: HubspacePlatform, accessory: PlatformAccessory);
    private configurePower;
    private configureBrightness;
    private configureTemperature;
    private configureColor;
    private getOn;
    private setOn;
    private getBrightness;
    private setBrightness;
    private getTemperature;
    private setTemperature;
    /**
     * Hue and Saturation work odd in Homekit. As Hubspace works in RGB color space with one item, Hue and Saturation
     * can come over in any order from Homekit. So we need to keep track of who is sent first and update once the other
     * comes over.
     */
    private hue;
    private saturation;
    private getHue;
    private setHue;
    private getSaturation;
    private setSaturation;
    private setColorMode;
    private throwErrorIfNullOrUndefined;
    private throwErrorIfNullOrUndefinedInt;
}
//# sourceMappingURL=light-accessory.d.ts.map