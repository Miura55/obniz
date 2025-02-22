"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS02PIR
 */
Object.defineProperty(exports, "__esModule", { value: true });
class IBS02PIR {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'iBS02PIR',
        };
    }
    static isDevice(peripheral) {
        if (this.deviceAdv.length > peripheral.adv_data.length) {
            return false;
        }
        for (let index = 0; index < this.deviceAdv.length; index++) {
            if (this.deviceAdv[index] === -1) {
                continue;
            }
            if (peripheral.adv_data[index] === this.deviceAdv[index]) {
                continue;
            }
            return false;
        }
        return true;
    }
    static getData(peripheral) {
        if (!IBS02PIR.isDevice(peripheral)) {
            return null;
        }
        return {
            battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
            event: Boolean(peripheral.adv_data[11] & 0b100),
        };
    }
}
exports.default = IBS02PIR;
IBS02PIR.deviceAdv = [
    0x02,
    0x01,
    0x06,
    0x12,
    0xff,
    0x0d,
    0x00,
    0x82,
    0xbc,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    0x01,
    -1,
    -1,
    -1,
];
