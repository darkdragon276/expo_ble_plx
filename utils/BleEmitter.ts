import { NativeEventEmitter, NativeModules } from 'react-native';

const bleEventEmitter = new NativeEventEmitter(NativeModules.BLEModule || {});

type BleEmitterProps = {
	roll: number;
	pitch: number;
	yaw: number;
};

export { type BleEmitterProps, bleEventEmitter };
