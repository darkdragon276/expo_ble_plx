import {
	BleError,
	BleErrorCode,
	BleManager,
	Device,
	State as BluetoothState,
	LogLevel,
	type DeviceId,
	type TransactionId,
	type UUID,
	type Characteristic,
	type Base64,
	type Subscription
} from 'react-native-ble-plx'
import { Alert, PermissionsAndroid, Platform } from 'react-native'
import Toast from 'react-native-toast-message';
import { KrossDevice } from './KrossDevice';

const deviceNotConnectedErrorText = 'Device is not connected'

class BLEServiceInstance {
	manager: BleManager

	device: Device | null
	deviceId: DeviceId | null = null

	deviceSupportInfo: {
		name?: string | null;
		visible?: boolean;
		lastSync?: number;
		batteryLevel?: number;
		firmwareVersion?: string;
	} = {}

	listDevices: Device[] = []

	characteristicMonitor: Subscription | null

	isCharacteristicMonitorDisconnectExpected = false

	timeoutHandle: NodeJS.Timeout | null = null

	secCounter: number = -1;

	private lockUpdate: boolean = false;

	startSequence = async () => {
		this.lockUpdate = true;
		const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
		
		await this.manager.cancelDeviceConnection(this.deviceId!);
		console.log("cancelDeviceConnection");

		await this.manager.startDeviceScan([this.SERVICE_UUID], { legacyScan: false }, (error, device) => {});
		console.log("startDeviceScan");
 
		await delay(1000);
		await this.manager.stopDeviceScan();
		console.log("stopDeviceScan");

		let device = await this.manager.connectToDevice(this.deviceId!, { timeout: 1000, autoConnect: false })
			.catch(error => {
				if (error.errorCode === BleErrorCode.DeviceAlreadyConnected) {
					return;
				}
				this.deviceSupportInfo = { lastSync: this.deviceSupportInfo!.lastSync };
				this.deviceId = null;
				console.log("Connect error: " + error.message);
			});
	};

	stopSequence = () => {
		this.lockUpdate = false;
	}

	readonly SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
	readonly DATA_IN_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
	readonly DATA_OUT_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

	readonly BATTERY_SERVICE_UUID = "180F";
	readonly BATTERY_LEVEL_UUID = "2A19";

	readonly DEVICE_INFORMATION_SERVICE_UUID = "180A";
	readonly FIRMWARE_REVISION_UUID = "2A26";
	readonly MODEL_NUMBER_UUID = "2A24";
	readonly MANUFACTURER_NAME_UUID = "2A29";

	readonly READ_DATA_TRANSACTION_ID = "READ-DATA-ABC-123";
	readonly READ_BATTERY_TRANSACTION_ID = "READ-BATTERY-ABC-123";

	constructor() {
		this.device = null
		this.characteristicMonitor = null
		this.listDevices = []
		this.manager = new BleManager()
		this.manager.setLogLevel(LogLevel.Verbose)
	}

	setDeviceById = (id: DeviceId) => {
		console.log("Set device by id: " + id);
		if (this.deviceId !== id) {
			// if (this.deviceId !== null) {
			// 	this.manager.cancelDeviceConnection(this.deviceId).catch(console.error);
			// }
			this.deviceId = id;
		}
	}
	
	scanDeivces = async (onUpdateListDevice: (listDevices: Device[]) => void) => {
		this.listDevices = [];
		await this.manager.cancelDeviceConnection(this.deviceId!)
			.then(() => {
				// do nothing
			}).catch((error) => {
				// console.log("Cancel connection error: " + error.message);
			});

		await this.manager.startDeviceScan([this.SERVICE_UUID], { legacyScan: false }, (error, device) => {
			if (error) {
				console.error("Scan error: " + error.message);
				// this.onError(error);
				this.manager.stopDeviceScan();
				return;
			}
			if (device) {
				if (!this.listDevices.some(d => d.id === device.id)) {
					this.listDevices.push(device);
				}
				onUpdateListDevice(this.listDevices);
			}
		});
	}

	updateInfo = async () => {
		this.secCounter++;
		// Scan for devices every 60s, scan for 50s and stop for 10s
		if (this.lockUpdate) return;

		if (this.deviceId === null) return;

		console.log("Update for devices");
		if (this.secCounter % 20 === 0) {
			await this.manager.stopDeviceScan().catch((error) => {
				// this.onError(error);
			});
		}
		let device = await this.manager.connectToDevice(this.deviceId, { timeout: 1000, autoConnect: false })
			.catch(error => {
				if (error.errorCode === BleErrorCode.DeviceAlreadyConnected) {
					return;
				}
				console.log("Connect error: " + error.message);
			});
		if (!device) {
			this.deviceSupportInfo = { lastSync: this.deviceSupportInfo!.lastSync };
			this.deviceId = null;
			return;
		};

		this.device = device
		this.deviceSupportInfo!.name = device.name;
		this.deviceSupportInfo!.visible = true;
		this.deviceSupportInfo!.lastSync = Date.now();

		if (this.secCounter % 2 === 0) {
			let device = await this.manager.discoverAllServicesAndCharacteristicsForDevice(this.deviceId)
				.catch((error) => {
					console.log("Discover error: " + error.message);
				});

			let battChar = await this.manager.readCharacteristicForDevice(this.deviceId, this.BATTERY_SERVICE_UUID, this.BATTERY_LEVEL_UUID)
				.catch(error => {
					console.log("Read battery level error: " + error.message);
				});
			if (battChar?.value) {
				this.deviceSupportInfo!.batteryLevel = KrossDevice.decodeBattery(battChar?.value);
			}

			let FWChar = await this.manager.readCharacteristicForDevice(this.deviceId, this.DEVICE_INFORMATION_SERVICE_UUID, this.FIRMWARE_REVISION_UUID)
				.catch(error => {
					console.log("Read firmware version error: " + error.message);
				});
			if (FWChar?.value) {
				this.deviceSupportInfo!.firmwareVersion = KrossDevice.decodeFirmwareVersion(FWChar?.value);
			}
		}
	}

	createNewManager = () => {
		this.manager = new BleManager()
		this.manager.setLogLevel(LogLevel.Verbose)
	}

	isDeviceVisible = (): boolean => {
		return this.deviceSupportInfo?.visible === true;
	}

	getDevice = () => this.device

	initializeBLE = () =>
		new Promise<void>(resolve => {
			const subscription = this.manager.onStateChange(state => {
				switch (state) {
					case BluetoothState.Unsupported:
						this.showErrorToast('')
						break
					case BluetoothState.PoweredOff:
						this.onBluetoothPowerOff()
						this.manager.enable().catch((error: BleError) => {
							if (error.errorCode === BleErrorCode.BluetoothUnauthorized) {
								this.requestBluetoothPermission()
							}
						})
						break
					case BluetoothState.Unauthorized:
						this.requestBluetoothPermission()
						break
					case BluetoothState.PoweredOn:
						resolve()
						subscription.remove()
						break
					default:
						console.error('Unsupported state: ', state)
					// resolve()
					// subscription.remove()
				}
			}, true)
		})

	disconnectDevice = async () => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText)
			throw new Error(deviceNotConnectedErrorText)
		}

		let cancelFunction = await this.manager
			.cancelDeviceConnection(this.device.id)
			.then(() => {
				//do nothing
			})
			.catch(error => {
				if (error?.code !== BleErrorCode.DeviceDisconnected) {
					this.onError(error)
				}
			})
		return cancelFunction;
	}

	disconnectDeviceById = (id: DeviceId) =>
		this.manager
			.cancelDeviceConnection(id)
			.then(() => this.showSuccessToast('Device disconnected'))
			.catch(error => {
				if (error?.code !== BleErrorCode.DeviceDisconnected) {
					this.onError(error)
				}
			})

	onBluetoothPowerOff = () => {
		Alert.alert('Bluetooth is turned off', `Please turn on Bluetooth`, [
			{
				text: 'OK',
			}
		]);
	}

	scanDevices = async (onDeviceFound: (device: Device) => void, UUIDs: UUID[] | null = null, legacyScan?: boolean) => {
		this.manager
			.startDeviceScan(UUIDs, { legacyScan }, (error, device) => {
				if (error) {
					this.onError(error)
					console.error(error.message)
					this.manager.stopDeviceScan()
					return
				}
				if (device) {
					onDeviceFound(device)
				}
			})
			.then(() => { })
			.catch(console.error)
	}

	stopDeviceScan = () => {
		this.manager.stopDeviceScan()
	}

	connectToDevice = (deviceId: DeviceId, timeout?: number, ignoreError = false) =>
		new Promise<Device>((resolve, reject) => {
			this.manager
				.connectToDevice(deviceId, { timeout })
				.then(device => {
					this.device = device
					resolve(device)
				})
				.catch(error => {
					if (error.errorCode === BleErrorCode.DeviceAlreadyConnected && this.device) {
						resolve(this.device)
					} else {
						if (!ignoreError) {
							this.onError(error)
						}
						reject(error)
					}
				})
		})

	discoverAllServicesAndCharacteristicsForDevice = async () =>
		new Promise<Device>((resolve, reject) => {
			if (!this.device) {
				this.showErrorToast(deviceNotConnectedErrorText)
				reject(new Error(deviceNotConnectedErrorText))
				return
			}
			this.manager
				.discoverAllServicesAndCharacteristicsForDevice(this.device.id)
				.then(device => {
					resolve(device)
					this.device = device
				})
				.catch(error => {
					this.onError(error)
					reject(error)
				})
		})

	readCharacteristicForDevice = async (serviceUUID: UUID, characteristicUUID: UUID) =>
		new Promise<Characteristic>((resolve, reject) => {
			if (!this.device) {
				this.showErrorToast(deviceNotConnectedErrorText)
				reject(new Error(deviceNotConnectedErrorText))
				return
			}
			this.manager
				.readCharacteristicForDevice(this.device.id, serviceUUID, characteristicUUID)
				.then(characteristic => {
					resolve(characteristic)
				})
				.catch(error => {
					this.onError(error)
				})
		})

	writeCharacteristicWithResponseForDevice = async (serviceUUID: UUID, characteristicUUID: UUID, time: Base64) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText)
			throw new Error(deviceNotConnectedErrorText)
		}
		return this.manager
			.writeCharacteristicWithResponseForDevice(this.device.id, serviceUUID, characteristicUUID, time)
			.catch(error => {
				this.onError(error)
			})
	}

	writeCharacteristicWithoutResponseForDevice = async (serviceUUID: UUID, characteristicUUID: UUID, time: Base64) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText)
			throw new Error(deviceNotConnectedErrorText)
		}
		return this.manager
			.writeCharacteristicWithoutResponseForDevice(this.device.id, serviceUUID, characteristicUUID, time)
			.catch(error => {
				this.onError(error)
			})
	}

	setupMonitor = (
		serviceUUID: UUID,
		characteristicUUID: UUID,
		onCharacteristicReceived: (characteristic: Characteristic) => void,
		onError: (error: Error) => void,
		transactionId?: TransactionId,
		hideErrorDisplay?: boolean
	) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText)
			throw new Error(deviceNotConnectedErrorText)
		}
		this.characteristicMonitor = this.manager.monitorCharacteristicForDevice(
			this.device?.id,
			serviceUUID,
			characteristicUUID,
			(error, characteristic) => {
				if (error) {
					onError(error)
					if (error.errorCode === 2 && this.isCharacteristicMonitorDisconnectExpected) {
						this.isCharacteristicMonitorDisconnectExpected = false
						return
					}
					if (!hideErrorDisplay) {
						this.onError(error)
						this.characteristicMonitor?.remove()
					}
					return
				}
				if (characteristic) {
					onCharacteristicReceived(characteristic)
				}
			},
			transactionId
		)
	}

	setupCustomMonitor: BleManager['monitorCharacteristicForDevice'] = (...args) =>
		this.manager.monitorCharacteristicForDevice(...args)

	finishMonitor = () => {
		this.isCharacteristicMonitorDisconnectExpected = true
		this.characteristicMonitor?.remove()
	}

	writeDescriptorForDevice = async (
		serviceUUID: UUID,
		characteristicUUID: UUID,
		descriptorUUID: UUID,
		data: Base64
	) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText)
			throw new Error(deviceNotConnectedErrorText)
		}
		return this.manager
			.writeDescriptorForDevice(this.device.id, serviceUUID, characteristicUUID, descriptorUUID, data)
			.catch(error => {
				this.onError(error)
			})
	}

	readDescriptorForDevice = async (serviceUUID: UUID, characteristicUUID: UUID, descriptorUUID: UUID) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText)
			throw new Error(deviceNotConnectedErrorText)
		}
		return this.manager
			.readDescriptorForDevice(this.device.id, serviceUUID, characteristicUUID, descriptorUUID)
			.catch(error => {
				this.onError(error)
			})
	}

	getServicesForDevice = () => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText)
			throw new Error(deviceNotConnectedErrorText)
		}
		return this.manager.servicesForDevice(this.device.id).catch(error => {
			this.onError(error)
		})
	}

	getCharacteristicsForDevice = (serviceUUID: UUID) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText)
			throw new Error(deviceNotConnectedErrorText)
		}
		return this.manager.characteristicsForDevice(this.device.id, serviceUUID).catch(error => {
			this.onError(error)
		})
	}

	getDescriptorsForDevice = (serviceUUID: UUID, characteristicUUID: UUID) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText)
			throw new Error(deviceNotConnectedErrorText)
		}
		return this.manager.descriptorsForDevice(this.device.id, serviceUUID, characteristicUUID).catch(error => {
			this.onError(error)
		})
	}

	isDeviceConnected = () => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText)
			throw new Error(deviceNotConnectedErrorText)
		}
		return this.manager.isDeviceConnected(this.device.id)
	}

	isDeviceWithIdConnected = (id: DeviceId) => this.manager.isDeviceConnected(id).catch(console.error)

	getConnectedDevices = (expectedServices: UUID[]) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText)
			throw new Error(deviceNotConnectedErrorText)
		}
		return this.manager.connectedDevices(expectedServices).catch(error => {
			this.onError(error)
		})
	}

	requestMTUForDevice = (mtu: number) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText)
			throw new Error(deviceNotConnectedErrorText)
		}
		return this.manager.requestMTUForDevice(this.device.id, mtu).catch(error => {
			this.onError(error)
		})
	}

	onDeviceDisconnected = (listener: (error: BleError | null, device: Device | null) => void) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText)
			throw new Error(deviceNotConnectedErrorText)
		}
		return this.manager.onDeviceDisconnected(this.device.id, listener)
	}

	onDeviceDisconnectedCustom: BleManager['onDeviceDisconnected'] = (...args) =>
		this.manager.onDeviceDisconnected(...args)

	readRSSIForDevice = () => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText)
			throw new Error(deviceNotConnectedErrorText)
		}
		return this.manager.readRSSIForDevice(this.device.id).catch(error => {
			this.onError(error)
		})
	}

	getDevices = () => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText)
			throw new Error(deviceNotConnectedErrorText)
		}
		return this.manager.devices([this.device.id]).catch(error => {
			this.onError(error)
		})
	}

	cancelTransaction = (transactionId: TransactionId) => this.manager.cancelTransaction(transactionId)

	enable = () =>
		this.manager.enable().catch(error => {
			this.onError(error)
		})

	disable = () =>
		this.manager.disable().catch(error => {
			this.onError(error)
		})

	getState = () =>
		this.manager.state().catch(error => {
			this.onError(error)
		})

	onError = (error: BleError) => {
		switch (error.errorCode) {
			case BleErrorCode.BluetoothUnauthorized:
				this.requestBluetoothPermission()
				break
			case BleErrorCode.LocationServicesDisabled:
				this.showErrorToast('Location services are disabled')
				break
			default:
				this.showErrorToast(JSON.stringify(error, null, 4))
		}
	}

	requestConnectionPriorityForDevice = (priority: 0 | 1 | 2) => {
		if (!this.device) {
			this.showErrorToast(deviceNotConnectedErrorText)
			throw new Error(deviceNotConnectedErrorText)
		}
		return this.manager.requestConnectionPriorityForDevice(this.device?.id, priority)
	}

	// cancelDeviceConnection = () => {
	// 	if (!this.device) {
	// 		this.showErrorToast(deviceNotConnectedErrorText)
	// 		throw new Error(deviceNotConnectedErrorText)
	// 	}
	// 	return this.manager.cancelDeviceConnection(this.device?.id)
	// }

	requestBluetoothPermission = async () => {
		if (Platform.OS === 'ios') {
			return true
		}
		if (Platform.OS === 'android') {
			const apiLevel = parseInt(Platform.Version.toString(), 10)
			let granted = false;
			if (PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION && PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION) {
				const result = await PermissionsAndroid.requestMultiple([
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
					PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
				])

				granted = (result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
					result['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED)
			}

			if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN && PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
				const result = await PermissionsAndroid.requestMultiple([
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
				])

				granted = granted && (
					result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
					result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED
				)
			}
			// console.log("Permission granted");
			return granted;
		}

		this.showErrorToast('Permission have not been granted')

		return false
	}

	showErrorToast = (error: string) => {
		// Toast.show({
		// 	type: 'error',
		// 	text1: 'Error',
		// 	text2: error
		// })
		// console.error(error)
	}

	showSuccessToast = (info: string) => {
		// Toast.show({
		// 	type: 'success',
		// 	text1: 'Success',
		// 	text2: info
		// })
	}
}

export const BLEService = new BLEServiceInstance()