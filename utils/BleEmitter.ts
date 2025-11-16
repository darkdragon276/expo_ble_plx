import { NativeEventEmitter, NativeModules } from 'react-native';

const safeModule = {
	addListener: () => { },
	removeListeners: () => { },
	...NativeModules,
};

const bleEventEmitter = new NativeEventEmitter(safeModule);

type BleEmitterProps = {
	roll: number;
	pitch: number;
	yaw: number;
};

export { type BleEmitterProps, bleEventEmitter };
