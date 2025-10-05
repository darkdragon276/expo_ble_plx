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

let _connectDeviceStep: boolean = false;
let _initSensorStep: boolean = false;
let _holdDeviceStep: boolean = false;
// let _xAxis: boolean = false;
// let _yAxis: boolean = false;
// let _zAxis: boolean = false;

let roll_Z_Left: number = 0;
let roll_Z_Right: number = 0;
let pitch_Y_Up: number = 0;
let pitch_Y_Down: number = 0;
let yaw_X_Left: number = 0;
let yaw_X_Right: number = 0;

const CalibrationsProgress = () => {
	const { stt_c_cpl, stt_hold_dv } = useCheckStep();
	const krossDevice = new KrossDevice();

	const [connectDeviceStep, setConnectDeviceStep] = useState("pending");
	const [initSensorStep, setInitSensorStep] = useState("pending");
	const [holdDeviceStep, setHoldDeviceStep] = useState("pending");
	const [xAxis, setXAxis] = useState("pending");
	const [yAxis, setYAxis] = useState("pending");
	const [zAxis, setZAxis] = useState("pending");
	const [complete, setComplete] = useState("pending");

	useEffect(() => {
		const initiateCalibration = async () => {
			if (BLEService.getDevice() == null) {
				BLEService.scanDevices((device) => {
					BLEService.connectToDevice(device.id).then(() => {
						_connectDeviceStep = true;
						_initSensorStep = true;
						_holdDeviceStep = true;
					})
				}, [BLEService.SERVICE_UUID]);
			} else {
				BLEService.connectToDevice(BLEService.getDevice()!.id).then(() => {
					_connectDeviceStep = true;
					_initSensorStep = true;
					_holdDeviceStep = true;
				})
			}
		};

		runSequentialCalibarion();

		initiateCalibration().then(() => {
			onDataDevice();
		});

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

	const onDataDevice = async () => {

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
					krossDevice.unpack(data);
					//console.log(krossDevice.angle);

					if (roll_Z_Left === 0 && roll_Z_Right === 0) {
						roll_Z_Left = krossDevice.angle.roll
						roll_Z_Right = krossDevice.angle.roll
					}

					if (krossDevice.angle.pitch > 0 && pitch_Y_Up === 0) {
						pitch_Y_Up = krossDevice.angle.pitch
					}

					if (krossDevice.angle.pitch < 0 && pitch_Y_Down === 0) {
						pitch_Y_Down = krossDevice.angle.pitch
					}

					if (krossDevice.angle.yaw > 0 && yaw_X_Left === 0) {
						yaw_X_Left = krossDevice.angle.yaw
					}

					if (krossDevice.angle.yaw < 0 && yaw_X_Right === 0) {
						yaw_X_Right = krossDevice.angle.yaw
					}

				} else {
					//console.log("Received data is null");
				}
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

	const tryConnectingDevice = async () => {
		setConnectDeviceStep("active");
		await waitUntil(() => _connectDeviceStep === true)
		return "done"
	};

	const tryInitSensor = async () => {
		setInitSensorStep("active");
		await waitUntil(() => _initSensorStep === true)
		return "done"
	};

	const trytHoldDevice = async () => {
		setHoldDeviceStep("active");
		await waitUntil(() => _holdDeviceStep === true)
		return "done"
	};

	const tryGetXAxis = async () => {
		setXAxis("active");
		await waitUntil(() => yaw_X_Left !== 0 && yaw_X_Right !== 0)
		return "done"
	};

	const tryGetYAxis = async () => {
		setYAxis("active");
		await waitUntil(() => pitch_Y_Up !== 0 && pitch_Y_Down !== 0)
		return "done"
	};

	const tryGetZAxis = async () => {
		setZAxis("active");
		await waitUntil(() => roll_Z_Left !== 0 && roll_Z_Right !== 0)
		return "done"
	};

	const runSequentialCalibarion = async () => {
		try {
			const r1 = await tryConnectingDevice();
			setConnectDeviceStep(r1);

			const r2 = await tryInitSensor();
			setInitSensorStep(r2);

			const r3 = await trytHoldDevice();
			setHoldDeviceStep(r3);

			const r4 = await tryGetXAxis();
			setXAxis(r4);

			const r5 = await tryGetYAxis();
			setYAxis(r5);

			const r6 = await tryGetZAxis();
			setZAxis(r6);

		} catch (err) {
			console.error('Error:', err);
		} finally {
			setComplete("done")
		}
	};

	const waitUntil = (condition: () => boolean, intervalMs = 1000): Promise<void> => {
		return new Promise((resolve) => {
			const interval = setInterval(() => {
				if (condition()) {
					clearInterval(interval);
					resolve();
				}
			}, intervalMs);
		});
	};

	return (
		<>
			{complete === "done"
				?
				(<CalibrationsDone></CalibrationsDone>)
				:
				(
					<>
						<DeviceConnectionStep connectDeviceStep={connectDeviceStep}></DeviceConnectionStep>
						<SensorInitializationStep initSensorStep={initSensorStep}></SensorInitializationStep>
						<HoldDeviceStep holdDeviceStep={holdDeviceStep}></HoldDeviceStep>
						<XAxisStep xAxis={xAxis}></XAxisStep>
						<YAxisStep yAxis={yAxis}></YAxisStep>
						<ZAxisStep zAxis={zAxis} ></ZAxisStep>
						<CalibrationCompleteStep complete={complete}></CalibrationCompleteStep>
					</>
				)
			}
		</>
	)
}

export default CalibrationsProgress