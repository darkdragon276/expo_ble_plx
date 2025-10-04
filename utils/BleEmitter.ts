import { NativeEventEmitter, NativeModules } from 'react-native';
const bleEventEmitter = new NativeEventEmitter(NativeModules.BLEModule || {}); 
export default bleEventEmitter;