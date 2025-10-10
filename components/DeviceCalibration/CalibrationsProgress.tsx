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

let _X_Done: boolean = false;
let _Y_Done: boolean = false;
let _Z_Done: boolean = false;

let _X_Sum_Angle: number = 0;
let _X_Yaw_Pre: number = 0;

let _Y_Sum_Angle: number = 0;
let _Y_Yaw_Pre: number = 0;

let _Z_Sum_Angle: number = 0;
let _Z_Yaw_Pre: number = 0;

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
		reSet()

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

			await BLEService.discoverAllServicesAndCharacteristicsForDevice();
		};

		const excuteCalibration = async () => {
			await connectDevice();
			await onDataGetAxis();
		}

		runSequentialCalibarion();
		excuteCalibration();

		return () => {
			reSet();
			clearInterval(interval);
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

	const reSet = () => {
		_connectDeviceStep = false;
		_initSensorStep = false;
		_holdDeviceStep = false;
		_completeStep = false;
		_X_Done = false;
		_Y_Done = false;
		_Z_Done = false;
		_X_Sum_Angle = 0;
		_X_Yaw_Pre = 0;
		_Y_Sum_Angle = 0;
		_Y_Yaw_Pre = 0;
		_Z_Sum_Angle = 0;
		_Z_Yaw_Pre = 0;
	};

	const getYaw_X = (yaw: number) => {
		_X_Sum_Angle += KrossDevice.normalizeAngle(yaw - _X_Yaw_Pre);

		if (_X_Sum_Angle >= 360 || _X_Sum_Angle <= -360) {
			_X_Done = true;
		}
		_X_Yaw_Pre = yaw;
		//console.log("_X_Sum_Angle: ", _X_Sum_Angle);
	}

	const getYaw_Y = (yaw: number) => {
		_Y_Sum_Angle += KrossDevice.normalizeAngle(yaw - _Y_Yaw_Pre);

		if (_Y_Sum_Angle >= 360 || _Y_Sum_Angle <= -360) {
			_Y_Done = true;
		}
		_Y_Yaw_Pre = yaw;
		//console.log("_Y_Sum_Angle: ", _Y_Sum_Angle);
	}

	const getYaw_Z = (yaw: number) => {
		_Z_Sum_Angle += KrossDevice.normalizeAngle(yaw - _Z_Yaw_Pre);

		if (_Z_Sum_Angle >= 360 || _Z_Sum_Angle <= -360) {
			_Z_Done = true;
		}
		_Z_Yaw_Pre = yaw;
		//console.log("_Z_Sum_Angle: ", _Z_Sum_Angle);
	}

	const onDataGetAxis = async () => {
		if (BLEService.getDevice() == null) {
			Alert.alert('', `No connected device: `);
			return;
		}

		try {
			const onError = (error: Error): void => {
				if (error) {
					return;
				}
				return;
			};

			const onMonitor = (char: Characteristic) => {
				let data = krossDevice.onDataReceived(KrossDevice.decodeBase64(char?.value ?? ""));
				if (data) {
					krossDevice.unpack(data);

					if (!_X_Done) {
						if (krossDevice.accel.x <= 1.1 && krossDevice.accel.x >= 0.9
							|| krossDevice.accel.x >= -1.1 && krossDevice.accel.x <= -0.9
						) {
							getYaw_X(krossDevice.angle.yaw);
						}
					}

					if (_X_Done) {
						if (krossDevice.accel.y <= 1.1 && krossDevice.accel.y >= 0.9
							|| krossDevice.accel.y >= -1.1 && krossDevice.accel.y <= -0.9
						) {
							getYaw_Y(krossDevice.angle.yaw);
						}
					}

					if (_Y_Done) {
						if (krossDevice.accel.z <= 1.1 && krossDevice.accel.z >= 0.9
							|| krossDevice.accel.z >= -1.1 && krossDevice.accel.z <= -0.9
						) {
							getYaw_Z(krossDevice.angle.yaw);
						}
					}
				}
			}

			BLEService.setupMonitor(BLEService.SERVICE_UUID, BLEService.DATA_OUT_UUID, onMonitor, onError, BLEService.READ_DATA_TRANSACTION_ID);
		} catch (e: any) {
			Alert.alert('', e?.message ?? String(e));
		}
	};

	const tryConnectingDevice = async (): Promise<void> => {
		if (connectDeviceStep === "done") {
			return new Promise<void>((resolve) => { resolve() });
		}

		setConnectDeviceStep("active");
		await waitUntil(() => _connectDeviceStep === true)
			.then(() => {
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
		await waitUntil(() => _initSensorStep === true)
			.then(() => {
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
		await waitUntil(() => _holdDeviceStep === true)
			.then(() => {
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
		await waitUntil(() => _X_Done == true)
			.then(() => {
				return new Promise<void>((resolve) => {
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
		await waitUntil(() => _Y_Done === true)
			.then(() => {
				return new Promise<void>((resolve) => {
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
		await waitUntil(() => _Z_Done === true)
			.then(() => {
				return new Promise<void>((resolve) => {
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
		await waitUntil(() => _Z_Done === true)
			.then(() => {
				setTimeout(() => {
					BLEService.writeCharacteristicWithResponseForDevice(
						BLEService.SERVICE_UUID,
						BLEService.DATA_IN_UUID,
						KrossDevice.encodeCmd(krossDevice.pack(KrossDevice.Cmd.MAGNET_CALIB_STOP))
					);
					_completeStep = true;
					setComplete("done");
				}, 1500);
			})
	};

	const runSequentialCalibarion = async () => {
		try {
			await tryConnectingDevice();
			await tryInitSensor();
			await trytHoldDevice();
			await tryGetXAxis();
			await tryGetYAxis();
			await tryGetZAxis();
			await tryGetComplete();

		} catch (err) {
			console.error('Error:', err);
		}
	};

	const waitUntil = (condition: () => boolean, intervalMs = 1500): Promise<void> => {
		return new Promise((resolve) => {
			interval = setInterval(() => {
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