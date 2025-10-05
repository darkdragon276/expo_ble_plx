import CalibrationsProgressStep from '../DeviceCalibration/CalibrationsProgressStep'
import CalibrationsDone from './CalibrationsDone'
import HoldDeviceStep from './CalibrationSteps/HoldDeviceStep'
import SensorInitializationStep from './CalibrationSteps/SensorInitializationStep'
import XAxisStep from './CalibrationSteps/XAxisStep'
import YAxisStep from './CalibrationSteps/YAxisStep'
import ZAxisStep from './CalibrationSteps/ZAxisStep'
import DeviceConnectionStep from "./CalibrationSteps/DeviceConnectionStep";
import CalibrationCompleteStep from "./CalibrationSteps/CalibrationCompleteStep";
import useCheckStep from "../../hooks/calibrationHook/useCheckStep";
import { useEffect, useState } from 'react'
import { BLEService } from '../../ble/BLEService'
import { Characteristic } from 'react-native-ble-plx'
import { KrossDevice } from '../../ble/KrossDevice'
import { Alert } from 'react-native'
import { bleEventEmitter } from '../../utils/BleEmitter'

const CalibrationsProgress = () => {
	const { stt_c_cpl, stt_hold_dv } = useCheckStep();
	const krossDevice = new KrossDevice();

	const [connectDeviceStep, setConnectDeviceStep] = useState("pending");
	const [initSensorStep, setInitSensorStep] = useState("pending");
	const [holdDeviceStep, setHoldDeviceStep] = useState("pending");
	// const [connectDeviceStep, setConnectDeviceStep] = useState("pending");
	// const [connectDeviceStep, setConnectDeviceStep] = useState("pending");
	// const [connectDeviceStep, setConnectDeviceStep] = useState("pending");
	// const [connectDeviceStep, setConnectDeviceStep] = useState("pending");
	// const [connectDeviceStep, setConnectDeviceStep] = useState("pending");

	useEffect(() => {
		const initiateCalibration = async () => {

			// if (BLEService.getDevice() == null) {
			// 	BLEService.scanDevices((device) => {
			// 		BLEService.connectToDevice(device.id).then(() => {
			// 			bleEventEmitter.emit('CALIBRATION_CONNECT_DEVICE', true);

			// 		}).catch((e) => {
			// 			bleEventEmitter.emit('CALIBRATION_CONNECT_DEVICE', false);

			// 		})
			// 	}, [BLEService.SERVICE_UUID]);
			// } else {
			// 	BLEService.connectToDevice(BLEService.getDevice()!.id).then(() => {
			// 		bleEventEmitter.emit('CALIBRATION_CONNECT_DEVICE', true)

			// 	}).catch((e) => {
			// 		bleEventEmitter.emit('CALIBRATION_CONNECT_DEVICE', false);

			// 	})
			// }
			setConnectDeviceStep("active");

			if (BLEService.getDevice() == null) {
				BLEService.scanDevices((device) => {
					BLEService.connectToDevice(device.id);
				}, [BLEService.SERVICE_UUID]);
			} else {
				BLEService.connectToDevice(BLEService.getDevice()!.id);
			}

		};

		// initiateCalibration().then(() => {
		// 	//bleEventEmitter.emit('CALIBRATION_CONNECT_DEVICE', true)
		// 	//console.log('initiateCalibration finally');
		// 	runStepCalibation();
		// });

		return () => {
			try {
				if (BLEService.getDevice() != null) {
					BLEService.cancelTransaction(BLEService.READ_DATA_TRANSACTION_ID);
					BLEService.disconnectDevice();
				}
			} catch (cleanupError) {
				//console.error("Error to cleanup BleManager:", cleanupError);
			}
		};

	}, []);

	const runStepCalibation = async () => {

		if (BLEService.getDevice() == null) {
			Alert.alert('Connect error', `No connected device: `);
			return;
		}

		try {
			const onError = (error: Error): void => {
				if (error) {
					Alert.alert('BLE Error', error?.message ?? String(error));
					return;
				}
				return;
			};

			const onMonitor = (char: Characteristic) => {
				//console.log('onMonitor running');
				let data = krossDevice.onDataReceived(KrossDevice.decodeBase64(char?.value ?? ""));
				if (data) {
					//bleEventEmitter.emit('CALIBRATION_CONNECT_DEVICE', true)
					krossDevice.unpack(data);
					//krossDevice.log();
					console.log(krossDevice.angle);
					bleEventEmitter.emit('CALIBRATION_X', krossDevice.angle.roll);
					bleEventEmitter.emit('CALIBRATION_Y', krossDevice.angle.pitch);
					bleEventEmitter.emit('CALIBRATION_Z', krossDevice.angle.yaw);

				} else {
					//console.log("Received data is null");
				}

				// setTimeout(() => {
				// 	BLEService.cancelTransaction(BLEService.READ_DATA_TRANSACTION_ID).then(() => {
				// 		BLEService.disconnectDevice();
				// 	})
				// }, 3000)
			}

			//console.log('runStepCalibation is unpacking');

			await BLEService.discoverAllServicesAndCharacteristicsForDevice();
			BLEService.setupMonitor(BLEService.SERVICE_UUID, BLEService.DATA_OUT_UUID, onMonitor, onError, BLEService.READ_DATA_TRANSACTION_ID);
			// BLEService.writeCharacteristicWithoutResponseForDevice(
			// 			BLEService.SERVICE_UUID,
			// 			BLEService.DATA_IN_UUID,
			// 			KrossDevice.encodeBase64(krossDevice.pack(KrossDevice.Cmd.MAGNET_CALIB_START))
			// 		);
		} catch (e: any) {
			//Alert.alert('connect error', e?.message ?? String(e));
		}
	};

	const intervalRunCali = setInterval(() => {

	}, 1000);

	return (
		<>
			{stt_c_cpl === "done"
				?
				(<CalibrationsDone></CalibrationsDone>)
				:
				(
					<>
						<DeviceConnectionStep
							// connectDeviceStep={connectDeviceStep}
						>
						</DeviceConnectionStep>
						<SensorInitializationStep
							// initSensorStep={initSensorStep}
						></SensorInitializationStep>
						<HoldDeviceStep ></HoldDeviceStep>
						<XAxisStep></XAxisStep>
						<YAxisStep></YAxisStep>
						<ZAxisStep></ZAxisStep>
						<CalibrationCompleteStep></CalibrationCompleteStep>
					</>
				)
			}
		</>
	)
}

export default CalibrationsProgress