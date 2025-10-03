import { BleManager, Device, State } from 'react-native-ble-plx';
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

type ScannedDevice = {
	id: string;
	name: string | null;
	rssi: number | null;
	device: Device;
};

const SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";

const useScanDevice = () => {

	const managerRef = useRef<BleManager | null>(null);
	const [isScanning, setIsScanning] = useState(false);
	const [devicesMap, setDevicesMap] = useState<Map<string, ScannedDevice>>(new Map());
	const [, setStateVersion] = useState(0);

	useEffect(() => {
		let manager: BleManager;
		let sub: any;

		try {
			manager = new BleManager();
			managerRef.current = manager;

			sub = manager.onStateChange((state: State) => {
				console.log('BLE State changed:', state);
				// you can prompt user to turn on BT if state is 'PoweredOff'

				if (state === 'PoweredOff') {
					Alert.alert('Bluetooth off', 'Turn off device to Scan!');
				}
			}, true);

		} catch (error) {
			Alert.alert('Can not init BleManager');
			//console.error("Can't  BleManager:", error);
		}

		startScan();

		return () => {
			try {
				sub.remove();
				stopScan();
				manager.destroy();
				managerRef.current = null;
			} catch (cleanupError) {
				//console.error("Error to cleanup BleManager:", cleanupError);
			}
		};
	}, []);

	const startScan = async () => {
		const manager = managerRef.current;
		if (!manager) return;

		// Clear previous results
		setDevicesMap(new Map());

		try {
			// On iOS you don't need to request runtime permission here (Info.plist required)
			// On Android you must request ACCESS_FINE_LOCATION / BLUETOOTH_SCAN depending on SDK level.
			setIsScanning(true);
			manager.startDeviceScan([SERVICE_UUID], { allowDuplicates: false }, (error, scannedDevice) => {
				if (error) {
					Alert.alert('Scan error', `${error.message}`);
					setIsScanning(false);
					return;
				}
				if (scannedDevice) {
					addOrUpdateDevice(scannedDevice);
				}
			});

			// Auto-stop scan after 20 seconds to save battery
			setTimeout(() => {
				stopScan();
			}, 20000);

		} catch (e: any) {
			//console.warn('Failed to start scan', e);
			Alert.alert('Failed to start scan', e?.message ?? String(e));
			setIsScanning(false);
		}
	};

	const stopScan = () => {
		const manager = managerRef.current;
		try {
			manager?.stopDeviceScan();
		} catch (e) {
			console.warn('stopScan error', e);
		}
		setIsScanning(false);
	};

	const addOrUpdateDevice = (device: Device) => {
		setDevicesMap(prev => {
			const next = new Map(prev);
			next.set(device.id, {
				id: device.id,
				name: device.name ?? device.localName ?? null,
				rssi: device.rssi ?? null,
				device
			});
			return next;
		});
		setStateVersion(v => v + 1);
	};

	return devicesMap
}

export default useScanDevice;