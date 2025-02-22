/**
 * @packageDocumentation
 * @module Parts.MPU6050
 */

import Obniz from '../../../obniz';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import I2cImu6, {
  accelRange,
  gyroRange,
  I2cImu6AbstractOptions,
  Inertia6,
  Xyz,
} from '../../i2cImu6';
import { I2cInfo } from '../../i2cParts';

export interface MPU6050Options extends I2cImu6AbstractOptions {}

export default class MPU6050 extends I2cImu6 {
  public static info(): ObnizPartsInfo {
    return {
      name: 'MPU6050',
    };
  }

  protected static commands: any = {
    whoami: 0x75,
    whoami_result: 0x71,
    pwr_mgmt_1: 0x6b,
    pwr_mgmt_2: 0x6c,
    smplrt_div: 0x19,
    int_pin_cfg: 0x37,
    int_enable: 0x38,
    user_ctrl: 0x6a,
    config: 0x1a,
    fifo_en: 0x23,
    accel_x_h: 0x3b,
    accel_x_l: 0x3c,
    accel_y_h: 0x3d,
    accel_y_l: 0x3e,
    accel_z_h: 0x3f,
    accel_z_l: 0x40,
    temp_h: 0x41,
    temp_l: 0x42,
    gyro_x_h: 0x43,
    gyro_x_l: 0x44,
    gyro_y_h: 0x45,
    gyro_y_l: 0x46,
    gyro_z_h: 0x47,
    gyro_z_l: 0x48,
    gyro_config: 0x1b,
    accel_config: 0x1c,
    accel_fs_sel: {
      '2g': 0x00,
      '4g': 0x08,
      '8g': 0x10,
      '16g': 0x18,
    },
    gyro_fs_sel: {
      '250dps': 0x00,
      '500dps': 0x08,
      '1000dps': 0x10,
      '2000dps': 0x18,
    },
  };

  public i2cinfo: I2cInfo;

  constructor() {
    super();
    this.i2cinfo = {
      address: 0x68,
      clock: 100000,
      voltage: '3v',
      pull: '3v',
    };
  }

  public calcTemp(data?: number | null): number | null {
    if (typeof data === 'undefined' || data === null) {
      return null;
    }
    return data / 333.87 + 21;
  }

  public wired(obniz: Obniz) {
    super.wired(obniz);
    this.init();
  }

  public init() {
    this.write(MPU6050.commands.pwr_mgmt_1, 0x00);
    this.obniz.wait(10);
    // set dlpf
    this.obniz.wait(1);
    this.write(MPU6050.commands.config, 0x01);
    // set samplerate div
    this.obniz.wait(1);
    this.write(MPU6050.commands.smplrt_div, 0x05);
    // interrupt enable
    this.obniz.wait(1);
    this.write(MPU6050.commands.int_enable, 0x00);
    this.obniz.wait(1);
    this.write(MPU6050.commands.user_ctrl, 0x00);
    this.obniz.wait(1);
    this.write(MPU6050.commands.fifo_en, 0x00);
    this.obniz.wait(1);
    this.write(MPU6050.commands.int_pin_cfg, 0x22);
    this.obniz.wait(1);
    this.write(MPU6050.commands.int_enable, 0x01);
    this.obniz.wait(1);
    this.setConfig(2, 250);
  }

  public async sleepWait() {
    await this.writeFlagWait(MPU6050.commands.pwr_mgmt_1, 6);
  }

  public async wakeWait() {
    await this.clearFlagWait(MPU6050.commands.pwr_mgmt_1, 6);
  }

  public async resetWait() {
    await this.writeFlagWait(MPU6050.commands.pwr_mgmt_1, 7);
  }

  public async configDlpfWait() {}

  public async bypassMagnetometerWait(flag = true): Promise<void> {
    // Enable I2C bypass to access for MPU9250 magnetometer access.
    if (flag === true) {
      await this.writeFlagWait(MPU6050.commands.int_pin_cfg, 1);
    } else {
      await this.clearFlagWait(MPU6050.commands.int_pin_cfg, 1);
    }
    // this.i2c.write(this.address, [MPU6050.commands.int_pin_cfg]);
    // const data =  await this.i2c!.readWait(this.address, 1);
    // data[0] |= MPU6050.commands.intPinConfigMask.bypass_en;
    // this.i2c.write(this.address, [MPU6050.commands.int_pin_cfg, data[0]]);
  }

  public async whoamiWait(): Promise<number> {
    const result = await this.readWait(MPU6050.commands.whoami, 1);
    return result[0];
  }

  public async getAccelAdcWait(): Promise<Xyz> {
    const raw = await this.readWait(MPU6050.commands.accel_x_h, 6);
    return MPU6050.charArrayToXyz(raw, 'b');
  }

  public async getGyroAdcWait(): Promise<Xyz> {
    const raw = await this.readWait(MPU6050.commands.gyro_x_h, 6);
    return MPU6050.charArrayToXyz(raw, 'b');
  }

  public async getTempAdcWait(): Promise<number> {
    const raw = await this.readWait(MPU6050.commands.temp_h, 2);
    return MPU6050.charArrayToInt16(raw as [number, number], 'b');
  }

  public async getAllAdcWait(): Promise<Inertia6> {
    const raw = await this.readWait(MPU6050.commands.accel_x_h, 14);
    return {
      accelerometer: MPU6050.charArrayToXyz(raw.slice(0, 6), 'b'),
      gyroscope: MPU6050.charArrayToXyz(raw.slice(8, 14), 'b'),
      temperature: MPU6050.charArrayToInt16(
        raw.slice(6, 8) as [number, number],
        'b'
      ),
    };
  }

  public setAccelRange(accel_range: accelRange): void {
    if (accel_range in MPU6050.commands.accel_fs_sel) {
      this.write(
        MPU6050.commands.accel_config,
        MPU6050.commands.accel_fs_sel[accel_range]
      );
      this.accel_so = accel_range;
    } else {
      throw new Error(
        `Invalid accel range. Valid values are: ${Object.keys(
          MPU6050.commands.accel_fs_sel
        ).join()}`
      );
    }
  }

  public setGyroRange(gyro_range: gyroRange): void {
    if (gyro_range in MPU6050.commands.gyro_fs_sel) {
      this.write(
        MPU6050.commands.gyro_config,
        MPU6050.commands.gyro_fs_sel[gyro_range]
      );
      this.gyro_so = gyro_range;
    } else {
      throw new Error(
        `Invalid gyro range. Valid values are: ${Object.keys(
          MPU6050.commands.gyro_fs_sel
        ).join()}`
      );
    }
  }

  public setConfig(
    accelerometer_range: number,
    gyroscope_range: number,
    ADC_cycle?: any
  ) {
    // accel range set (0x00:2g, 0x08:4g, 0x10:8g, 0x18:16g)
    switch (accelerometer_range) {
      case 2:
        this.setAccelRange('2g');
        break;
      case 4:
        this.setAccelRange('4g');
        break;
      case 8:
        this.setAccelRange('8g');
        break;
      case 16:
        this.setAccelRange('16g');
        break;
      default:
        throw new Error('accel_range variable 2,4,8,16 setting');
    }
    // gyro range & LPF set (0x00:250, 0x08:500, 0x10:1000, 0x18:2000[deg/s])
    switch (gyroscope_range) {
      case 250:
        this.setGyroRange('250dps');
        break;
      case 500:
        this.setGyroRange('500dps');
        break;
      case 1000:
        this.setGyroRange('1000dps');
        break;
      case 2000:
        this.setGyroRange('2000dps');
        break;
      default:
        throw new Error('accel_range variable 250,500,1000,2000 setting');
    }
  }
}
