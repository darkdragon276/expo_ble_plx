import CalibrationsDone from './CalibrationsDone'
import HoldDeviceStep from './CalibrationSteps/HoldDeviceStep'
import SensorInitializationStep from './CalibrationSteps/SensorInitializationStep'
import XAxisStep from './CalibrationSteps/XAxisStep'
import YAxisStep from './CalibrationSteps/YAxisStep'
import ZAxisStep from './CalibrationSteps/ZAxisStep'
import DeviceConnectionStep from "./CalibrationSteps/DeviceConnectionStep";
import CalibrationCompleteStep from "./CalibrationSteps/CalibrationCompleteStep";
import { useEffect, useState } from 'react'
import { BLEService } from '../../ble/BLEService'
import { Characteristic } from 'react-native-ble-plx'
import { KrossDevice } from '../../ble/KrossDevice'
import { Alert } from 'react-native'

let _connectDeviceStep: boolean = false;
let _initSensorStep: boolean = false;
let _holdDeviceStep: boolean = false;
let _completeStep: boolean = false;

let _X: boolean = false;
let _Y: boolean = false;
let _Z: boolean = false;

let roll_Z_Left: number = 0;
let roll_Z_Right: number = 0;
let pitch_Y_Up: number = 0;
let pitch_Y_Down: number = 0;
let yaw_X_Left: number = 0;
let yaw_X_Right: number = 0;

const CalibrationsProgress = () => {
	const krossDevice = new KrossDevice();

	const [connectDeviceStep, setConnectDeviceStep] = useState("pending");
	const [initSensorStep, setInitSensorStep] = useState("pending");
	const [holdDeviceStep, setHoldDeviceStep] = useState("pending");
	const [xAxis, setXAxis] = useState("pending");
	const [yAxis, setYAxis] = useState("pending");
	const [zAxis, setZAxis] = useState("pending");
	const [complete, setComplete] = useState("pending");
	let interval: ReturnType<typeof setInterval>;

	useEffect(() => {
		_connectDeviceStep = false;
		_initSensorStep = false;
		_holdDeviceStep = false;
		_completeStep = false;
		_X = false;
		_Y = false;
		_Z = false;
		roll_Z_Left = 0;
		roll_Z_Right = 0;
		pitch_Y_Up = 0;
		pitch_Y_Down = 0;
		yaw_X_Left = 0;
		yaw_X_Right = 0;

		const connectDevice = async () => {

			if (BLEService.getDevice() == null) {
				await BLEService.scanDevices((device) => {
					BLEService.connectToDevice(device.id).then(() => {
						_connectDeviceStep = true;
						_initSensorStep = true;
						_holdDeviceStep = true;
					})
				}, [BLEService.SERVICE_UUID]);
			} else {
				await BLEService.connectToDevice(BLEService.getDevice()!.id).then(() => {
					_connectDeviceStep = true;
					_initSensorStep = true;
					_holdDeviceStep = true;
				})
			}
		};

		const excuteCalibration = async () => {
			await connectDevice();
			await onDataDevice();
		}

		runSequentialCalibarion();
		excuteCalibration();

		return () => {
			clearInterval(interval);
			_connectDeviceStep = false;
			_initSensorStep = false;
			_holdDeviceStep = false;
			_completeStep = false;
			roll_Z_Left = 0;
			roll_Z_Right = 0;
			pitch_Y_Up = 0;
			pitch_Y_Down = 0;
			yaw_X_Left = 0;
			yaw_X_Right = 0;

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

	// const deplayStep = async (callback: () => void): Promise<void> => {
	// 	return new Promise((resolve) => {
	// 		setTimeout(() => {
	// 			callback();
	// 			resolve();
	// 		}, 2000);
	// 	});
	// };

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
					console.log(krossDevice.angle);

					if (krossDevice.angle.yaw > 30 && yaw_X_Left === 0) {
						yaw_X_Left = krossDevice.angle.yaw
					}

					if (krossDevice.angle.yaw < -30 && yaw_X_Right === 0) {
						yaw_X_Right = krossDevice.angle.yaw
					}

					if (_X) {
						if (krossDevice.angle.pitch > 30 && pitch_Y_Up === 0) {
							pitch_Y_Up = krossDevice.angle.pitch
						}

						if (krossDevice.angle.pitch < -30 && pitch_Y_Down === 0) {
							pitch_Y_Down = krossDevice.angle.pitch
						}
					}

					if (_Y) {
						if (roll_Z_Left === 0 && roll_Z_Right === 0) {
							roll_Z_Left = krossDevice.angle.roll
							roll_Z_Right = krossDevice.angle.roll
						}
					}
				}
			}

			await BLEService.discoverAllServicesAndCharacteristicsForDevice();
			BLEService.setupMonitor(BLEService.SERVICE_UUID, BLEService.DATA_OUT_UUID, onMonitor, onError, BLEService.READ_DATA_TRANSACTION_ID);
		} catch (e: any) {
			//Alert.alert('connect error', e?.message ?? String(e));
		}
	};

	const tryConnectingDevice = async (): Promise<void> => {
		if (connectDeviceStep === "done") {
			return new Promise<void>((resolve) => { resolve() });
		}

		setConnectDeviceStep("active");
		await waitUntil(() => _connectDeviceStep === true).then(() => {
			return new Promise<void>((resolve) => {
				BLEService.writeCharacteristicWithResponseForDevice(
					BLEService.SERVICE_UUID,
					BLEService.DATA_IN_UUID,
					KrossDevice.encodeCmd(krossDevice.pack(KrossDevice.Cmd.MAGNET_CALIB_START))
				);
				_connectDeviceStep = false;
				setConnectDeviceStep("done");
				resolve();
			})
		})
	};

	const tryInitSensor = async (): Promise<void> => {
		if (initSensorStep === "done") {
			return new Promise<void>((resolve) => { resolve() });
		}

		setInitSensorStep("active");
		await waitUntil(() => _initSensorStep === true).then(() => {
			return new Promise<void>((resolve) => {
				_initSensorStep = false;
				setInitSensorStep("done");
				resolve();
			})
		})
	};

	const trytHoldDevice = async (): Promise<void> => {

		if (holdDeviceStep === "done") {
			return new Promise<void>((resolve) => { resolve() });
		}

		setHoldDeviceStep("active");
		await waitUntil(() => _holdDeviceStep === true).then(() => {
			return new Promise<void>((resolve) => {
				_holdDeviceStep = false;
				setHoldDeviceStep("done");
				resolve();
			})
		})
	};

	const tryGetXAxis = async (): Promise<void> => {

		if (xAxis === "done") {
			return new Promise<void>((resolve) => { resolve() });
		}

		setXAxis("active");
		await waitUntil(() => yaw_X_Left !== 0 && yaw_X_Right !== 0).then(() => {
			return new Promise<void>((resolve) => {
				_X = true;
				yaw_X_Left = 0;
				yaw_X_Right = 0;
				setXAxis("done");
				resolve();
			})
		})
	};

	const tryGetYAxis = async (): Promise<void> => {

		if (yAxis === "done") {
			return new Promise<void>((resolve) => { resolve() });
		}

		setYAxis("active");
		await waitUntil(() => pitch_Y_Up !== 0 && pitch_Y_Down !== 0).then(() => {
			return new Promise<void>((resolve) => {
				_Y = true;
				pitch_Y_Up = 0;
				pitch_Y_Down = 0;
				setYAxis("done");
				resolve();
			})
		})
	};

	const tryGetZAxis = async (): Promise<void> => {

		if (zAxis === "done") {
			return new Promise((resolve) => { resolve() });
		}

		setZAxis("active");
		await waitUntil(() => roll_Z_Left !== 0 && roll_Z_Right !== 0).then(() => {
			return new Promise<void>((resolve) => {
				_Z = true;
				roll_Z_Left = 0;
				roll_Z_Right = 0;
				setZAxis("done");
				resolve();
			})
		})
	};

	const tryGetComplete = async (): Promise<void> => {

		if (complete === "done") {
			return new Promise<void>((resolve) => { resolve() });
		}

		setComplete("active");
		await waitUntil(() => _completeStep === false).then(() => {
			return new Promise<void>((resolve) => {
				BLEService.writeCharacteristicWithResponseForDevice(
					BLEService.SERVICE_UUID,
					BLEService.DATA_IN_UUID,
					KrossDevice.encodeCmd(krossDevice.pack(KrossDevice.Cmd.MAGNET_CALIB_STOP))
				);
				_completeStep = false;
				setComplete("done");
				resolve();
			})
		})
	};

	const runSequentialCalibarion = async () => {
		try {
			await tryConnectingDevice();
			await tryInitSensor();
			await trytHoldDevice();
			await tryGetXAxis();
			await tryGetYAxis();
			//await tryGetZAxis();
			await tryGetComplete();

		} catch (err) {
			console.error('Error:', err);
		}
	};

	const waitUntil = (condition: () => boolean, intervalMs = 2000): Promise<void> => {
		return new Promise((resolve) => {
			interval = setInterval(() => {
				//console.log(condition())
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
						{/* <ZAxisStep zAxis={zAxis} ></ZAxisStep> */}
						<CalibrationCompleteStep complete={complete}></CalibrationCompleteStep>
					</>
				)
			}
		</>
	)
}

export default CalibrationsProgress