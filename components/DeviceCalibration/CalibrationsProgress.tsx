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
import { BleError, BleErrorCode, Characteristic } from 'react-native-ble-plx'
import { KrossDevice } from '../../ble/KrossDevice'
import { Alert } from 'react-native'
import { useNavigation} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "../../model/RootStackParamList";
type NavigationProp = StackNavigationProp<RootStackParamList>;

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

const MIN_ACCEL = 0.7;
const MAX_ACCEL = 1.3;
const CalibrationsProgress = () => {
	const navigation = useNavigation<NavigationProp>();
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
		if (BLEService.deviceId == null) {
			Alert.alert('No device connected', `Please connect device from Dashboard`, [
				{
					text: 'OK',
					onPress: () => navigation.replace("Main"),
				}
			]);
			return;
		}
		BLEService.startSequence();
		reSet()

		const excuteCalibration = async () => {
			_connectDeviceStep = true;
			_initSensorStep = true;
			_holdDeviceStep = true;
			await BLEService.discoverAllServicesAndCharacteristicsForDevice()
				.catch((error) => {
					if (BLEService.isDisconnectError(error)) {
						BLEService.deviceId = null;
						Alert.alert('No device connected', `Please connect device from Dashboard`, [
							{
								text: 'OK',
								onPress: () => navigation.replace("Main"),
							}
						]);
					}
				});
		}

		runSequentialCalibarion();
		excuteCalibration();

		return () => {
			reSet();
			clearInterval(interval);
			try {
				if (BLEService.getDevice() != null) {
					BLEService.cancelTransaction(BLEService.READ_DATA_TRANSACTION_ID);
				}
			} catch (cleanupError) {
				//console.error("Error to cleanup BleManager:", cleanupError);
			}
			BLEService.stopSequence();
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
	}

	const getYaw_Y = (yaw: number) => {
		_Y_Sum_Angle += KrossDevice.normalizeAngle(yaw - _Y_Yaw_Pre);

		if (_Y_Sum_Angle >= 360 || _Y_Sum_Angle <= -360) {
			_Y_Done = true;
		}
		_Y_Yaw_Pre = yaw;
	}

	const getYaw_Z = (yaw: number) => {
		_Z_Sum_Angle += KrossDevice.normalizeAngle(yaw - _Z_Yaw_Pre);

		if (_Z_Sum_Angle >= 360 || _Z_Sum_Angle <= -360) {
			_Z_Done = true;
		}
		_Z_Yaw_Pre = yaw;
	}

	const onDataGetAxis = async () => {
		if (BLEService.getDevice() == null) {
			Alert.alert('', `No connected device: `);
			return;
		}

		try {
			const onError = (error: BleError): void => {
				if (BLEService.isDisconnectError(error) || 
					error.errorCode === BleErrorCode.CharacteristicNotifyChangeFailed ||
					error.errorCode === BleErrorCode.CharacteristicReadFailed) {
					BLEService.deviceId = null;
					Alert.alert('No device connected', `Please connect device from Dashboard`, [
						{
							text: 'OK',
							onPress: () => navigation.replace("Main"),
						}
					]);
				}
			};
			let count = 0;
			const onMonitor = (char: Characteristic) => {
				let data = krossDevice.onDataReceived(KrossDevice.decodeBase64(char?.value ?? ""));
				if (data) {
					krossDevice.unpack(data);
					count++;
					if (!_X_Done && !_Y_Done && !_Z_Done) {
						if (krossDevice.accel.x <= MAX_ACCEL && krossDevice.accel.x >= MIN_ACCEL
							|| krossDevice.accel.x >= -MAX_ACCEL && krossDevice.accel.x <= -MIN_ACCEL
						) {
							setXAxis("active_accel");
							getYaw_X(krossDevice.angle.yaw);
							count = 0;
						} else {
							setXAxis("active");
						}
					}

					if (_X_Done && !_Y_Done) {
						if (krossDevice.accel.y <= MAX_ACCEL && krossDevice.accel.y >= MIN_ACCEL
							|| krossDevice.accel.y >= -MAX_ACCEL && krossDevice.accel.y <= -MIN_ACCEL
						) {
							setYAxis("active_accel");
							getYaw_Y(krossDevice.angle.yaw);
							count = 0;
						} else if(count % 50 >= 40) {
							setYAxis("active");
						}
					}

					if (_Y_Done && !_Z_Done) {
						if (krossDevice.accel.z <= MAX_ACCEL && krossDevice.accel.z >= MIN_ACCEL
							|| krossDevice.accel.z >= -MAX_ACCEL && krossDevice.accel.z <= -MIN_ACCEL
						) {
							setZAxis("active_accel");
							getYaw_Z(krossDevice.angle.yaw);
						} else if(count % 50 >= 40) {
							setZAxis("active");
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
			.then(async () => {
				await BLEService.cancelTransaction(BLEService.READ_DATA_TRANSACTION_ID);
				await BLEService.writeCharacteristicWithResponseForDevice(
					BLEService.SERVICE_UUID,
					BLEService.DATA_IN_UUID,
					KrossDevice.encodeCmd(krossDevice.pack(KrossDevice.Cmd.MAGNET_CALIB_STOP))
				);
				setTimeout(() => {
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
			onDataGetAxis();
			await tryGetXAxis();
			await tryGetYAxis();
			await tryGetZAxis();
			await tryGetComplete();

		} catch (err) {
			console.error('Error:', err);
		}
	};

	const waitUntil = (condition: () => boolean, intervalMs = 1000): Promise<void> => {
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