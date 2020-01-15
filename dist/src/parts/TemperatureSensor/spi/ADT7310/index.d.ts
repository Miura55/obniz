import Obniz from "../../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
export interface ADT7310Options {
}
export declare class ADT7310 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    params: any;
    spi: any;
    constructor();
    wired(obniz: Obniz): void;
    getTempWait(): Promise<number>;
}
export default ADT7310;
