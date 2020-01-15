import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface KXSC7_2050Options {
}
declare class KXSC7_2050 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    params: any;
    ad_x: any;
    ad_y: any;
    ad_z: any;
    gravity: any;
    onchangex: any;
    onchangey: any;
    onchangez: any;
    constructor();
    wired(obniz: any): Promise<void>;
}
export default KXSC7_2050;
