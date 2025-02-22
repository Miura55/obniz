/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from './WSCommand';

class WSCommandUart extends WSCommand {
  public module: any;
  public _CommandInit: any;
  public _CommandDeinit: any;
  public _CommandSend: any;
  public _CommandRecv: any;
  public sendCommand: any;
  public validateCommandSchema: any;
  public WSCommandNotFoundError: any;

  constructor() {
    super();
    this.module = 4;

    this._CommandInit = 0;
    this._CommandDeinit = 1;
    this._CommandSend = 2;
    this._CommandRecv = 3;
  }

  // Commands

  public init(params: any, module: any) {
    const buf: any = new Uint8Array(13);
    buf[0] = module;
    buf[1] = parseInt(params.tx);
    buf[2] = parseInt(params.rx);

    buf[3] = params.baud >> (3 * 8);
    buf[4] = params.baud >> (2 * 8);
    buf[5] = params.baud >> (1 * 8);
    buf[6] = params.baud;

    if (params.stop === 1) {
      buf[7] = 1;
    } else if (params.stop === 1.5) {
      buf[7] = 2;
    } else if (params.stop === 2) {
      buf[7] = 3;
    } else if (params.stop === 0) {
      buf[7] = 0;
    } else {
      throw new Error('uart: invalid stop bits');
    }

    buf[8] = params.bits;

    if (params.parity === 'even') {
      buf[9] = 2;
    } else if (params.parity === 'odd') {
      buf[9] = 3;
    }

    if (params.flowcontrol === 'rts') {
      buf[10] = 2;
    } else if (params.flowcontrol === 'cts') {
      buf[10] = 3;
    } else if (params.flowcontrol === 'rts-cts') {
      buf[10] = 4;
    }

    if (params.rts !== null) {
      buf[11] = params.rts;
    }
    if (params.cts !== null) {
      buf[12] = params.cts;
    }

    this.sendCommand(this._CommandInit, buf);
  }

  public deinit(params: any, module: any) {
    const buf: any = new Uint8Array(1);
    buf[0] = module;
    this.sendCommand(this._CommandDeinit, buf);
  }

  public send(params: any, module: any) {
    const buf: any = new Uint8Array(1 + params.data.length);
    buf[0] = module;
    buf.set(params.data, 1);
    this.sendCommand(this._CommandSend, buf);
  }

  public parseFromJson(json: any) {
    // 0~2
    for (let i = 0; i < 3; i++) {
      const module: any = json['uart' + i];
      if (module === undefined) {
        continue;
      }
      const schemaData: any = [
        { uri: '/request/uart/init', onValid: this.init },
        { uri: '/request/uart/send', onValid: this.send },
        { uri: '/request/uart/deinit', onValid: this.deinit },
      ];
      const res: any = this.validateCommandSchema(
        schemaData,
        module,
        'uart' + i,
        i
      );

      if (res.valid === 0) {
        if (res.invalidButLike.length > 0) {
          throw new Error(res.invalidButLike[0].message);
        } else {
          throw new this.WSCommandNotFoundError(`[uart${i}]unknown command`);
        }
      }
    }
  }

  public notifyFromBinary(objToSend: any, func: any, payload: any) {
    if (func === this._CommandRecv && payload.byteLength > 1) {
      const module_index: any = payload[0];
      const arr: any = new Array(payload.byteLength - 1);
      for (let i = 0; i < arr.length; i++) {
        arr[i] = payload[i + 1];
      }

      objToSend['uart' + module_index] = {
        data: arr,
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

export default WSCommandUart;
