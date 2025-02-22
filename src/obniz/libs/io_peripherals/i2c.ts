/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import Obniz from '../../index';
import { ObnizI2cError, ObnizI2cWarning } from '../../ObnizError';
import { ComponentAbstract } from '../ComponentAbstact';
import ObnizUtil from '../utils/util';
import { PullType } from './common';

type I2CMode = 'master' | 'slave';

interface PeripheralI2CState {
  mode: I2CMode;
  sda: number;
  scl: number;
  pull?: PullType;
  gnd?: number;
}

interface PeripheralI2COptions extends PeripheralI2CState {
  mode: I2CMode;
  sda: number;
  scl: number;
  clock?: number;
  slave_address?: any;
  slave_address_length?: number;
}

/**
 * i2c can be used.
 * Master/Slave mode.
 * But slave mode only works with "written" events. You can't set data to be read.
 *
 * @category Peripherals
 */
class PeripheralI2C extends ComponentAbstract {
  /**
   * from obniz.js 1.14.0
   *
   * It sets a function to receive error when i2c bus error occurs.
   * By setting a function, obniz.error will never be called.
   *
   * ```javascript
   * // Javascript Example
   * obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000});
   * obniz.i2c0.onerror = function(err) {
   *   console.log('Error', err);
   * }
   * var ret = await obniz.i2c0.readWait(0x50, 1);
   * ```
   */
  public onerror?: (error: any) => void;

  /**
   * @ignore
   */
  public used!: boolean;

  /**
   * Slave mode only.
   *
   * It is a callback that is called when data is written.
   * Received data is fragmented.
   * When written data is 100byte, you possibly receive it in 56 byte and 44 byte.
   * For data over 1024 bytes, few bytes may be dropped.
   *
   * ```javascript
   * // Javascript Example
   * obniz.i2c0.start({mode: "slave", sda: 0, scl: 1, slave_address: 0x01});
   * obniz.i2c0.onwritten = function(data){
   *   console.log(data);
   * }
   * ```
   */
  public onwritten?: (data: number[], address: number) => void;
  private state!: PeripheralI2CState;
  private id: number;

  constructor(obniz: Obniz, id: number) {
    super(obniz);
    this.id = id;
    this.onerror = undefined;

    this.on('/response/i2c/slave', (obj) => {
      this.Obniz._runUserCreatedFunction(this.onwritten, obj.data, obj.address);
    });

    this.on('/response/i2c/error', (obj) => {
      const message: any = `i2c${this.id}: ${obj.error.message}`;
      if (typeof this.onerror === 'function') {
        this.Obniz._runUserCreatedFunction(this.onerror, new Error(message));
      } else {
        this.Obniz.error({
          alert: 'error',
          message,
        });
      }
    });
    this.on('/response/i2c/warning', (obj) => {
      this.Obniz.warning({
        alert: 'warning',
        message: `i2c${this.id}: ${obj.warning.message}`,
      });
    });

    this._reset();
  }

  /**
   * It starts i2c on given io sda, scl.
   *
   *
   * Internal pull up is optional for io output setting.
   * By default it is pull:null.
   * See more on obniz.ioX.pull().
   *
   * For using internal-pull-up, you should specify "3v" to connect to 3.3v targets, and "5v" for 5v targets.
   * When you choose internal pull up, speed is limited to up to 100khz, because internal pull up is not so tough.
   * Please add external pull-up resistor on scl/sda and choose pull:null when you need more speed.
   *
   *
   * ```javascript
   * // Javascript Example
   * obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000});
   * obniz.i2c0.write(0x50, [0x00, 0x00, 0x12]);
   * var ret = await obniz.i2c0.readWait(0x50, 1);
   * console.log("read "+ret);
   * ```
   *
   * - use internal pull up
   *
   * ```javascript
   * obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000, pull:"5v"});
   * ```
   *
   * - save mode
   *
   * ```javascript
   * obniz.i2c0.start({mode: "slave", sda: 0, scl: 1, slave_address: 0x01});
   * ```
   *
   * @param arg
   */
  public start(arg: PeripheralI2COptions) {
    const err: any = ObnizUtil._requiredKeys(arg, ['mode', 'sda', 'scl']);
    if (err) {
      throw new Error("I2C start param '" + err + "' required, but not found ");
    }
    this.state = ObnizUtil._keyFilter(arg, [
      'mode',
      'sda',
      'scl',
      'pull',
      'gnd',
    ]);

    const ioKeys: (keyof PeripheralI2CState)[] = ['sda', 'scl', 'gnd'];
    for (const key of ioKeys) {
      if (this.state[key] && !this.Obniz.isValidIO(this.state[key])) {
        throw new Error("i2c start param '" + key + "' are to be valid io no");
      }
    }

    const mode: I2CMode = this.state.mode;
    const clock: number | null =
      typeof arg.clock === 'number' ? Math.floor(arg.clock) : null;
    const slave_address: number | null =
      typeof arg.slave_address === 'number'
        ? Math.floor(arg.slave_address)
        : null;
    const slave_address_length: number | null =
      typeof arg.slave_address_length === 'number'
        ? Math.floor(arg.slave_address_length)
        : null;

    if (mode !== 'master' && mode !== 'slave') {
      throw new Error('i2c: invalid mode ' + mode);
    }
    if (mode === 'master') {
      if (clock === null) {
        throw new Error('i2c: please specify clock when master mode');
      }
      if (clock <= 0 || clock > 1 * 1000 * 1000) {
        throw new Error('i2c: invalid clock ' + clock);
      }
      if (arg.pull === '5v' && clock > 400 * 1000) {
        throw new Error(
          'i2c: please use under 400khz when internal 5v internal pull-up'
        );
      }
      if (arg.pull === '3v' && clock > 100 * 1000) {
        throw new Error(
          'i2c: please use under 100khz when internal 3v internal pull-up'
        );
      }
    } else {
      if (slave_address === null) {
        throw new Error('i2c: please specify slave_address');
      }
      if (slave_address < 0 || slave_address > 0x7f) {
        throw new Error('i2c: invalid slave_address');
      }
      if (slave_address < 0 || slave_address > 0x7f) {
        throw new Error('i2c: invalid slave_address');
      }
      if (slave_address_length !== null && slave_address_length !== 7) {
        throw new Error('i2c: invalid slave_address_length. please specify 7');
      }
    }

    this.Obniz.getIO(this.state.sda).drive('open-drain');
    this.Obniz.getIO(this.state.scl).drive('open-drain');

    if (this.state.pull) {
      this.Obniz.getIO(this.state.sda).pull(this.state.pull);
      this.Obniz.getIO(this.state.scl).pull(this.state.pull);
    } else {
      this.Obniz.getIO(this.state.sda).pull(null);
      this.Obniz.getIO(this.state.scl).pull(null);
    }

    if (this.state.gnd !== undefined) {
      this.Obniz.getIO(this.state.gnd).output(false);
      const ioNames: any = {};
      ioNames[this.state.gnd] = 'gnd';
      if (this.Obniz.display) {
        this.Obniz.display.setPinNames('i2c' + this.id, ioNames);
      }
    }

    const startObj: any = ObnizUtil._keyFilter(this.state, [
      'mode',
      'sda',
      'scl',
    ]);
    if (mode === 'master') {
      startObj.clock = clock;
    } else {
      startObj.slave_address = slave_address;
      if (slave_address_length) {
        startObj.slave_address_length = slave_address_length;
      }
    }

    const obj: any = {};
    obj['i2c' + this.id] = startObj;
    this.used = true;
    this.Obniz.send(obj);
  }

  /**
   * It sends data to device which has the address
   *
   * ```
   * // Javascript Example
   * obniz.i2c0.start({mode: "master",sda:2, scl:3, clock:400000, pull:null});
   * obniz.i2c0.write(0x50, [0x00, 0x00, 0x12]);
   * ```
   *
   * @param address 7bit address only.
   * @param data Max length is 1024;
   */
  public write(address: number, data: number[]) {
    if (!this.used) {
      throw new Error(`i2c${this.id} is not started`);
    }
    address = parseInt(address as any);
    if (isNaN(address)) {
      throw new Error('i2c: please specify address');
    }
    if (address < 0 || address > 0x7f) {
      throw new Error('i2c: invalid address');
    }
    if (!data) {
      throw new Error('i2c: please provide data');
    }
    if (data.length > 1024) {
      throw new Error('i2c: data should be under 1024 bytes');
    }
    const obj: any = {};
    obj['i2c' + this.id] = {
      address,
      data,
    };
    this.Obniz.send(obj);
  }

  /**
   * It reads data from the device. length defines the length of bytes. The treatment of address is same as write() function.
   * This function will wait until data is received.
   *
   * ```javascript
   * // Javascript Example
   * obniz.i2c0.start({mode: "master",sda:2, scl:3, clock:400000, pull:null});
   * var ret = await obniz.i2c0.readWait(0x50, 1);
   * console.log("read "+ret);
   * ```
   *
   * @param address
   * @param length Max is 1024;
   */
  public async readWait(address: number, length: number): Promise<number[]> {
    if (!this.used) {
      throw new Error(`i2c${this.id} is not started`);
    }
    address = parseInt(address as any);
    if (isNaN(address)) {
      throw new Error('i2c: please specify address');
    }
    if (address < 0 || address > 0x7f) {
      throw new Error('i2c: invalid address');
    }
    length = parseInt(length as any);
    if (isNaN(length) || length < 0) {
      throw new Error('i2c: invalid length to read');
    }
    if (length > 1024) {
      throw new Error('i2c: data length should be under 1024 bytes');
    }

    const obj: any = {};
    obj['i2c' + this.id] = {
      address,
      read: length,
    };

    const errors = {
      '/response/i2c/error': ObnizI2cError,
      '/response/i2c/warning': ObnizI2cWarning,
    };
    const receiveData = await this.sendAndReceiveJsonWait(
      obj,
      '/response/i2c/master',
      { errors }
    );
    return receiveData.data;
  }

  /**
   * @ignore
   */
  public isUsed() {
    return this.used;
  }

  /**
   * end i2c .
   *
   * ```javascript
   * // Javascript Example
   * obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000});
   * obniz.i2c0.end();
   * ```
   */
  public end() {
    const obj: any = {};
    obj['i2c' + this.id] = null;
    this.Obniz.send(obj);
    this.used = false;
  }

  /**
   * @ignore
   * @private
   */
  public schemaBasePath(): string {
    return 'i2c' + this.id;
  }

  /**
   * @ignore
   * @private
   */
  protected _reset() {
    this.used = false;
    this.onwritten = undefined;
  }
}

export default PeripheralI2C;
