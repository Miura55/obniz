"use strict";
/**
 * @packageDocumentation
 * @module Parts.OMRON_2JCIE
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = __importDefault(require("../../../obniz/ObnizPartsBleInterface"));
class OMRON_2JCIE {
    constructor(peripheral) {
        this._peripheral = null;
        this.vibrationState = {
            0x00: 'NONE',
            0x01: 'druing vibration (Earthquake judgment in progress)',
            0x02: 'during earthquake',
        };
        if (peripheral && !OMRON_2JCIE.isDevice(peripheral)) {
            throw new Error('peripheral is not OMRON_2JCIE');
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: '2JCIE',
        };
    }
    static isDevice(peripheral) {
        return ((peripheral.localName && peripheral.localName.indexOf('Env') >= 0) ||
            (peripheral.localName && peripheral.localName.indexOf('IM') >= 0) ||
            (peripheral.localName && peripheral.localName.indexOf('Rbt') >= 0));
    }
    /**
     * Get a datas from advertisement mode of OMRON 2JCIE
     */
    static getData(peripheral) {
        const adv_data = peripheral.adv_data;
        if (peripheral.localName && peripheral.localName.indexOf('IM') >= 0) {
            return {
                temperature: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[8], adv_data[9]) *
                    0.01,
                relative_humidity: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[10], adv_data[11]) * 0.01,
                light: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[12], adv_data[13]) * 1,
                uv_index: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[14], adv_data[15]) * 0.01,
                barometric_pressure: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[16], adv_data[17]) * 0.1,
                sound_noise: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[18], adv_data[19]) * 0.01,
                acceleration_x: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[20], adv_data[21]),
                acceleration_y: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[22], adv_data[23]),
                acceleration_z: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[24], adv_data[25]),
                battery: (adv_data[26] + 100) / 100,
            };
        }
        else if (peripheral.localName &&
            peripheral.localName.indexOf('Rbt') >= 0 &&
            adv_data[6] === 0x02 &&
            adv_data[6] === 0x02 &&
            adv_data[7] === 0x01) {
            return {
                temperature: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[10], adv_data[9]) *
                    0.01,
                relative_humidity: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[12], adv_data[11]) * 0.01,
                light: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[14], adv_data[13]) * 1,
                barometric_pressure: ObnizPartsBleInterface_1.default.signed32FromBinary(adv_data[18], adv_data[17], adv_data[16], adv_data[15]) * 0.001,
                sound_noise: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[20], adv_data[19]) * 0.01,
                etvoc: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[22], adv_data[21]),
                eco2: ObnizPartsBleInterface_1.default.signed16FromBinary(adv_data[24], adv_data[23]),
            };
        }
        return null;
    }
    wired(obniz) {
        this.obniz = obniz;
    }
    async findWait() {
        const target = {
            localName: ['Env', 'Rbt'],
        };
        await this.obniz.ble.initWait();
        this._peripheral = await this.obniz.ble.scan.startOneWait(target);
        return this._peripheral;
    }
    omron_uuid(uuid, type) {
        if (type === 'BAG') {
            return `0C4C${uuid}-7700-46F4-AA96D5E974E32A54`;
        }
        else if (type === 'USB') {
            return `AB70${uuid}-0A3A-11E8-BA89-0ED5F89F718B`;
        }
        else {
            return undefined;
        }
    }
    async connectWait() {
        if (!this._peripheral) {
            await this.findWait();
        }
        if (!this._peripheral) {
            throw new Error('2JCIE not found');
        }
        if (!this._peripheral.connected) {
            this._peripheral.ondisconnect = (reason) => {
                if (typeof this.ondisconnect === 'function') {
                    this.ondisconnect(reason);
                }
            };
            await this._peripheral.connectWait();
        }
    }
    async disconnectWait() {
        if (this._peripheral && this._peripheral.connected) {
            await this._peripheral.disconnectWait();
        }
    }
    signedNumberFromBinary(data) {
        // little adian
        let val = data[data.length - 1] & 0x7f;
        for (let i = data.length - 2; i >= 0; i--) {
            val = val * 256 + data[i];
        }
        if ((data[data.length - 1] & 0x80) !== 0) {
            val = val - Math.pow(2, data.length * 8 - 1);
        }
        return val;
    }
    unsignedNumberFromBinary(data) {
        // little adian
        let val = data[data.length - 1];
        for (let i = data.length - 2; i >= 0; i--) {
            val = val * 256 + data[i];
        }
        return val;
    }
    async getLatestDataBAGWait() {
        return this.getLatestDataWait();
    }
    /**
     * @deprecated
     */
    getLatestData() {
        return this.getLatestDataWait();
    }
    async getLatestDataWait() {
        await this.connectWait();
        const c = this._peripheral.getService(this.omron_uuid('3000', 'BAG')).getCharacteristic(this.omron_uuid('3001', 'BAG'));
        const data = await c.readWait();
        const json = {
            row_number: data[0],
            temperature: this.signedNumberFromBinary(data.slice(1, 3)) * 0.01,
            relative_humidity: this.signedNumberFromBinary(data.slice(3, 5)) * 0.01,
            light: this.signedNumberFromBinary(data.slice(5, 7)) * 1,
            uv_index: this.signedNumberFromBinary(data.slice(7, 9)) * 0.01,
            barometric_pressure: this.signedNumberFromBinary(data.slice(9, 11)) * 0.1,
            sound_noise: this.signedNumberFromBinary(data.slice(11, 13)) * 0.01,
            discomfort_index: this.signedNumberFromBinary(data.slice(13, 15)) * 0.01,
            heatstroke_risk_factor: this.signedNumberFromBinary(data.slice(15, 17)) * 0.01,
            battery_voltage: this.unsignedNumberFromBinary(data.slice(17, 19)) * 0.001,
        };
        return json;
    }
    getLatestSensorDataUSB() {
        return this.getLatestSensorDataUSBWait();
    }
    async getLatestSensorDataUSBWait() {
        await this.connectWait();
        const c = this._peripheral.getService(this.omron_uuid('5010', 'USB')).getCharacteristic(this.omron_uuid('5012', 'USB'));
        const data = await c.readWait();
        const json = {
            seqence_number: data[0],
            temperature: this.signedNumberFromBinary(data.slice(1, 3)) * 0.01,
            relative_humidity: this.signedNumberFromBinary(data.slice(3, 5)) * 0.01,
            light: this.signedNumberFromBinary(data.slice(5, 7)) * 1,
            barometric_pressure: this.signedNumberFromBinary(data.slice(7, 11)) * 0.001,
            sound_noise: this.signedNumberFromBinary(data.slice(11, 13)) * 0.01,
            etvoc: this.signedNumberFromBinary(data.slice(13, 15)) * 1,
            eco2: this.signedNumberFromBinary(data.slice(15, 17)) * 1,
        };
        return json;
    }
    /**
     * @deprecated
     */
    getLatestCalculationDataUSB() {
        return this.getLatestCalculationDataUSBWait();
    }
    async getLatestCalculationDataUSBWait() {
        await this.connectWait();
        const c = this._peripheral.getService(this.omron_uuid('5010', 'USB')).getCharacteristic(this.omron_uuid('5013', 'USB'));
        const data = await c.readWait();
        const json = {
            sequence_number: data[0],
            disconfort_index: this.signedNumberFromBinary(data.slice(1, 3)) * 0.01,
            heatstroke_risk_factor: this.signedNumberFromBinary(data.slice(3, 5)) * 0.01,
            vibration_information: this.vibrationState[data[5]],
            si_value: this.unsignedNumberFromBinary(data.slice(6, 8)) * 0.1,
            pga: this.unsignedNumberFromBinary(data.slice(8, 10)) * 0.1,
            seismic_intensity: this.unsignedNumberFromBinary(data.slice(10, 12)) * 0.001,
            acceleration_x: this.signedNumberFromBinary(data.slice(12, 14)) * 1,
            acceleration_y: this.signedNumberFromBinary(data.slice(14, 16)) * 1,
            acceleration_z: this.signedNumberFromBinary(data.slice(16, 18)) * 1,
        };
        return json;
    }
}
exports.default = OMRON_2JCIE;
