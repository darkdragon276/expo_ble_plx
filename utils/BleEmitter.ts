import { NativeEventEmitter, NativeModules } from 'react-native';

const { BleManager } = NativeModules;

const bleEventEmitter =
	BleManager
		? new NativeEventEmitter(NativeModules.BLEModule || {})
		: new NativeEventEmitter();

type BleEmitterProps = {
	roll: number;
	pitch: number;
	yaw: number;
};

export { type BleEmitterProps, bleEventEmitter };