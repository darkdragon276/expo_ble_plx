import { Buffer } from "buffer";

export class KrossDevice {
    // Constants
    static readonly SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
    static readonly IN_UUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
    static readonly OUT_UUID = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';

    static readonly Cmd = {
        // For write commands - IN_UUID
        RESET_QUATERNION: 0x1001,
        MAPPING_AXIS: 0x1002,
        MAGNET_CALIB_START: 0x1003,
        MAGNET_CALIB_STOP: 0x1004,
        GET_MAPPING_AXIS: 0x1005,
        // For monitor notification - OUT_UUID
        GET_DATA: 0x060C,
        GET_MAPPING: 0x060D
    };

    static readonly SizeOf = {
        HEADER: 5, // LEN(1) + ID(2) + CMD(2)
        LEN: 1,
        ID: 2,
        CMD: 2,
        FOOTER: 2,
    };

    // Properties
    private _q = { x: 0, y: 0, z: 0, w: 0 };
    private _mag = { x: 0, y: 0, z: 0 };
    private _gyro = { x: 0, y: 0, z: 0 };
    private _accel = { x: 0, y: 0, z: 0 };
    private _angle = { roll: 0, pitch: 0, yaw: 0 };
    private _soc: number = 0; // State of charge

    private _mac: string = '';
    private _name: string = '';

    private _accelMapping = { x: "-X", y: "+Y", z: "+Z" };
    private _gyroMapping = { x: "+X", y: "-Y", z: "-Z" };
    private _magnetMapping = { x: "+X", y: "+Y", z: "+Z" };

    private static readonly AXIS_MAP: Record<number, string> = {
        0x00: "+X",
        0x01: "-X",
        0x02: "+Y",
        0x03: "-Y",
        0x04: "+Z",
        0x05: "-Z",
    };

    private static readonly CODE_MAP: Record<string, number> = Object.fromEntries(
        Object.entries(KrossDevice.AXIS_MAP).map(([k, v]) => [v, Number(k)])
    );

    static parseInt32(data: Uint8Array, byteOffset: number): number {
        return new DataView(data.buffer).getInt32(byteOffset, true);
    }

    static decodeBase64(str: string): string {
        return Buffer.from(str, 'base64').toString('binary');
    }

    static decodeBattery(str: string): number {
        return Buffer.from(str, 'base64')[0];
    }

    static decodeFirmwareVersion(str: string): string {
        return Buffer.from(str, 'base64').toString('utf8');
    }

    static encodeCmd(data: Uint8Array): string {
        return Buffer.from(data).toString('base64');
    }

    get q(): { x: number; y: number; z: number; w: number } {
        return this._q;
    }
    set q(value: { x: number; y: number; z: number; w: number } | { data: Uint8Array; byteOffset: number }) {
        if ('data' in value && 'byteOffset' in value) {
            this._q = {
                x: KrossDevice.parseInt32(value.data, value.byteOffset + 4 * 3) / 1000.0,
                y: KrossDevice.parseInt32(value.data, value.byteOffset + 4 * 2) / 1000.0,
                z: KrossDevice.parseInt32(value.data, value.byteOffset + 4 * 1) / 1000.0,
                w: KrossDevice.parseInt32(value.data, value.byteOffset + 4 * 0) / 1000.0,
            };
        } else {
            this._q = value as { x: number; y: number; z: number; w: number };
        }
    }

    get mag(): { x: number; y: number; z: number } {
        return this._mag;
    }
    set mag(value: { x: number; y: number; z: number } | { data: Uint8Array; byteOffset: number }) {
        if ('data' in value && 'byteOffset' in value) {
            this._mag = {
                x: KrossDevice.parseInt32(value.data, value.byteOffset + 4 * 0) / 1000.0,
                y: KrossDevice.parseInt32(value.data, value.byteOffset + 4 * 1) / 1000.0,
                z: KrossDevice.parseInt32(value.data, value.byteOffset + 4 * 2) / 1000.0,
            };
        } else {
            this._mag = value as { x: number; y: number; z: number };
        }
    }

    get gyro(): { x: number; y: number; z: number } {
        return this._gyro;
    }
    set gyro(value: { x: number; y: number; z: number } | { data: Uint8Array; byteOffset: number }) {
        if ('data' in value && 'byteOffset' in value) {
            this._gyro = {
                x: KrossDevice.parseInt32(value.data, value.byteOffset + 4 * 0) / 1000.0,
                y: KrossDevice.parseInt32(value.data, value.byteOffset + 4 * 1) / 1000.0,
                z: KrossDevice.parseInt32(value.data, value.byteOffset + 4 * 2) / 1000.0,
            };
        } else {
            this._gyro = value as { x: number; y: number; z: number };
        }
    }

    get accel(): { x: number; y: number; z: number } {
        return this._accel;
    }
    set accel(value: { x: number; y: number; z: number } | { data: Uint8Array; byteOffset: number }) {
        if ('data' in value && 'byteOffset' in value) {
            this._accel = {
                x: KrossDevice.parseInt32(value.data, value.byteOffset + 4 * 0) / 1000.0,
                y: KrossDevice.parseInt32(value.data, value.byteOffset + 4 * 1) / 1000.0,
                z: KrossDevice.parseInt32(value.data, value.byteOffset + 4 * 2) / 1000.0,
            };
        } else {
            this._accel = value as { x: number; y: number; z: number };
        }
    }

    get angle(): { roll: number; pitch: number; yaw: number } {
        return this._angle;
    }
    set angle(value: { roll: number; pitch: number; yaw: number } | { data: Uint8Array; byteOffset: number }) {
        if ('data' in value && 'byteOffset' in value) {
            this._angle = {
                roll: KrossDevice.parseInt32(value.data, value.byteOffset + 4 * 0) / 1000.0,
                pitch: KrossDevice.parseInt32(value.data, value.byteOffset + 4 * 1) / 1000.0,
                yaw: KrossDevice.parseInt32(value.data, value.byteOffset + 4 * 2) / 1000.0,
            };
        } else {
            this._angle = value as { roll: number; pitch: number; yaw: number };
        }
    }

    get soc(): number {
        return this._soc;
    }
    set soc(value: number | { data: Uint8Array; byteOffset: number }) {
        if (typeof value === 'object' && 'data' in value && 'byteOffset' in value) {
            this._soc = KrossDevice.parseInt32(value.data, value.byteOffset) / 1000.0;
        } else {
            this._soc = value as number;
        }
    }

    get mac(): string {
        return this._mac;
    }
    set mac(value: string) {
        this._mac = value;
    }

    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
    }

    set accelMapping(mapping: { x: string; y: string; z: string } | { data: Uint8Array; byteOffset: number }) {
        if ('data' in mapping && 'byteOffset' in mapping) {
            const Data = mapping.data;
            const offset = mapping.byteOffset;
            this._accelMapping = {
                x: KrossDevice.AXIS_MAP[Data[offset + 0]] ?? this._accelMapping.x,
                y: KrossDevice.AXIS_MAP[Data[offset + 1]] ?? this._accelMapping.y,
                z: KrossDevice.AXIS_MAP[Data[offset + 2]] ?? this._accelMapping.z,
            };
        } else {
            this._accelMapping = mapping as { x: string; y: string; z: string };
        }
    }

    get accelMapping(): { x: string; y: string; z: string } {
        return this._accelMapping;
    }

    set gyroMapping(mapping: { x: string; y: string; z: string } | { data: Uint8Array; byteOffset: number }) {
        if ('data' in mapping && 'byteOffset' in mapping) {
            const Data = mapping.data;
            const offset = mapping.byteOffset;
            this._gyroMapping = {
                x: KrossDevice.AXIS_MAP[Data[offset + 0]] ?? this._gyroMapping.x,
                y: KrossDevice.AXIS_MAP[Data[offset + 1]] ?? this._gyroMapping.y,
                z: KrossDevice.AXIS_MAP[Data[offset + 2]] ?? this._gyroMapping.z,
            };
        } else {
            this._gyroMapping = mapping as { x: string; y: string; z: string };
        }
    }

    get gyroMapping(): { x: string; y: string; z: string } {
        return this._gyroMapping;
    }

    set magnetMapping(mapping: { x: string; y: string; z: string } | { data: Uint8Array; byteOffset: number }) {
        if ('data' in mapping && 'byteOffset' in mapping) {
            const Data = mapping.data;
            const offset = mapping.byteOffset;
            this._magnetMapping = {
                x: KrossDevice.AXIS_MAP[Data[offset + 0]] ?? this._magnetMapping.x,
                y: KrossDevice.AXIS_MAP[Data[offset + 1]] ?? this._magnetMapping.y,
                z: KrossDevice.AXIS_MAP[Data[offset + 2]] ?? this._magnetMapping.z,
            };
        } else {
            this._magnetMapping = mapping as { x: string; y: string; z: string };
        }
    }

    get magnetMapping(): { x: string; y: string; z: string } {
        return this._magnetMapping;
    }

    log() {
        console.log('Quaternion:', this.q);
        console.log('Magnetometer:', this.mag);
        console.log('Gyroscope:', this.gyro);
        console.log('Accelerometer:', this.accel);
        console.log('Angle:', this.angle);
        console.log('State of Charge:', this.soc);
        console.log('MAC Address:', this.mac);
        console.log('Device Name:', this.name);
        console.log('Accelerometer Mapping:', this.accelMapping);
        console.log('Gyroscope Mapping:', this.gyroMapping);
        console.log('Magnetometer Mapping:', this.magnetMapping);
    }

    private rxBuff: Uint8Array = new Uint8Array(0);
    onDataReceived(input: string): Uint8Array | null {
        let bytes = input.length;
        if (bytes < 7) return null;

        // Copy input string to buffer using char codes
        const input_buffer = new Uint8Array(input.length);
        for (let i = 0; i < input.length; ++i) {
            input_buffer[i] = input.charCodeAt(i);
        }

        // Merge new input with rxBuff (FIFO)
        const merged = new Uint8Array(this.rxBuff.length + input_buffer.length);
        merged.set(this.rxBuff, 0);
        merged.set(input_buffer, this.rxBuff.length);
        this.rxBuff = merged;
        bytes = merged.length;

        // Packet extraction, footer need match with length of packet
        for (let i = 0; i < bytes;) {
            const expected_len = this.rxBuff[i];
            if (expected_len < 4 || i + expected_len + 2 >= bytes) {
                ++i;
                continue;
            }
            if (this.rxBuff[i + expected_len + 1] === 0xFE &&
                this.rxBuff[i + expected_len + 2] === 0xFE) {
                const packet = this.rxBuff.slice(i, i + expected_len + 1);
                // Remove processed data from rxBuff (FIFO)
                this.rxBuff = this.rxBuff.slice(i + expected_len + 3);
                return packet;
            }
            ++i;
        }

        // Prevent buffer overflow
        const MAX_BUFFER_SIZE = 256;
        if (this.rxBuff.length > MAX_BUFFER_SIZE) {
            this.rxBuff = this.rxBuff.slice(this.rxBuff.length - MAX_BUFFER_SIZE);
        }
        return null;
    }

    unpack(data: Uint8Array) {
        const msgCode = (data[3] << 8) | data[4];
        switch (msgCode) {
            case KrossDevice.Cmd.GET_DATA:
                if (data.length < 97) {
                    return null;
                }
                let offset = data.length - 84;
                this.mag = { data, byteOffset: offset };
                this.gyro = { data, byteOffset: offset + 12 };
                this.accel = { data, byteOffset: offset + 24 };
                this.soc = { data, byteOffset: offset + 36 };
                this.q = { data, byteOffset: offset + 44 };
                this.angle = { data, byteOffset: offset + 60 };

                // const arrayaa: number[] = new Array(9);
                // arrayaa[0] = 2 * fq0 * fq0 + 2 * fq1 * fq1 - 1;
                // arrayaa[1] = 2 * fq1 * fq2 - 2 * fq0 * fq3;
                // arrayaa[2] = 2 * fq1 * fq3 + 2 * fq0 * fq2;
                // arrayaa[3] = 2 * fq1 * fq2 + 2 * fq0 * fq3;
                // arrayaa[4] = 2 * fq0 * fq0 + 2 * fq2 * fq2 - 1;
                // arrayaa[5] = 2 * fq2 * fq3 - 2 * fq0 * fq1;
                // arrayaa[6] = 2 * fq1 * fq3 - 2 * fq0 * fq2;
                // arrayaa[7] = 2 * fq2 * fq3 + 2 * fq0 * fq1;
                // arrayaa[8] = 2 * fq0 * fq0 + 2 * fq3 * fq3 - 1;
                break;
            case KrossDevice.Cmd.GET_MAPPING:
                this.accelMapping = { data, byteOffset: 5 };
                this.gyroMapping = { data, byteOffset: 8 };
                this.magnetMapping = { data, byteOffset: 11 };
                break;
            default:
                // Unknown message code
                break;
        }
    }

    private msgId: number = 0;
    pack(cmd: number): Uint8Array {
        this.msgId = (this.msgId + 1) & 0x7FF;

        const msgId = this.msgId;
        const msgCode = cmd;

        let txBuff = new Uint8Array(20);
        let dataLength = 0;
        let txSize = 0;

        // Set message ID and code
        txBuff[1] = (msgId >> 8) & 0xFF;
        txBuff[2] = msgId & 0xFF;
        txBuff[3] = (msgCode >> 8) & 0xFF;
        txBuff[4] = msgCode & 0xFF;

        // Set data based on command
        switch (msgCode) {
            case KrossDevice.Cmd.RESET_QUATERNION:
            case KrossDevice.Cmd.GET_MAPPING_AXIS:
            case KrossDevice.Cmd.MAGNET_CALIB_START:
            case KrossDevice.Cmd.MAGNET_CALIB_STOP:
                dataLength = 0;
                break;
            case KrossDevice.Cmd.MAPPING_AXIS:
                dataLength = 9;
                const accelMapping = this.accelMapping as { x: string; y: string; z: string };
                const gyroMapping = this.gyroMapping as { x: string; y: string; z: string };
                const magnetMapping = this.magnetMapping as { x: string; y: string; z: string };

                txBuff[5] = KrossDevice.CODE_MAP[accelMapping.x] ?? 0;
                txBuff[6] = KrossDevice.CODE_MAP[accelMapping.y] ?? 0;
                txBuff[7] = KrossDevice.CODE_MAP[accelMapping.z] ?? 0;
                txBuff[8] = KrossDevice.CODE_MAP[gyroMapping.x] ?? 0;
                txBuff[9] = KrossDevice.CODE_MAP[gyroMapping.y] ?? 0;
                txBuff[10] = KrossDevice.CODE_MAP[gyroMapping.z] ?? 0;
                txBuff[11] = KrossDevice.CODE_MAP[magnetMapping.x] ?? 0;
                txBuff[12] = KrossDevice.CODE_MAP[magnetMapping.y] ?? 0;
                txBuff[13] = KrossDevice.CODE_MAP[magnetMapping.z] ?? 0;
                break;
            default:
                return new Uint8Array(0);
        }

        // Set length
        txBuff[0] = dataLength + KrossDevice.SizeOf.CMD + KrossDevice.SizeOf.ID;

        txSize = dataLength + KrossDevice.SizeOf.HEADER + KrossDevice.SizeOf.FOOTER;

        // Set footer
        txBuff[txSize - 2] = 0xFE;
        txBuff[txSize - 1] = 0xFE;
        return txBuff.slice(0, txSize);
    }

    static normalizeAngle(alpha: number) {
        alpha = ((alpha + 180) % 360 + 360) % 360;
        return alpha - 180;
    };
}