import { Text, View, Pressable, Modal, FlatList, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import { BleManager, Device, State } from 'react-native-ble-plx';
import MainDeviceStatus from './MainDeviceStatus';
//import { KrossDevice } from '../../ble/KrossDevice';
// import useScanDevice from '../../hooks/ble/useScanDevice';
//import { BLEService } from '../../ble/BLEService';
//import bleService from '../../ble/BLEService';
import BLEManagerInstance from "../../ble/BLEManager";

// type ScannedDevice = {
// 	id: string;
// 	name: string | null;
// 	rssi: number | null;
// 	device: Device;
// };

const SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const DATA_IN_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
const DATA_OUT_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

const MainDeviceList = () => {

	const managerRef = useRef<BleManager | null>(null);
	//const [isScanning, setIsScanning] = useState(false);
	const [devices, setDevices] = useState<Device[]>([]);
	const [deviceId, setSelectedDevice] = useState<string>("");
	const [open, setOpen] = useState(false);
	//const [, setStateVersion] = useState(0);
	//const krossDevice = new KrossDevice();

	

	useEffect(() => {
		console.log(`MainDeviceList useEffect running!`)
		let manager: BleManager;
		let sub: any;
		//console.log(`MainDeviceList useEffect run!`)
		
	//bleService.scanDevices(onSetDevice, [SERVICE_UUID], true)

		// BLEService.initializeBLE().then(() => {
		// 	BLEService.stopDeviceScan();
		// 	//console.log("BLE initialized!");
		// 	BLEService.scanDevices(onSetDevice, [SERVICE_UUID], true).then(()=>{
		// 		//console.log("BLE scanDevices!");
		// 		//
		// 	})
		// });

		//BLEManagerInstance.getInstance();

		try {
			manager = new BleManager();
			managerRef.current = manager;

			sub = manager.onStateChange((state: State) => {
				if (state === 'PoweredOff') {
					Alert.alert('Bluetooth off', 'Turn off device to Scan!');
				}
			}, true);
		} catch (error) {
			Alert.alert('Can not init BleManager');
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

	// const onSetDevice = (device: Device) => {
	// 	//setDevices([]);
	// 	setDevices((prev) => {
	// 		if (prev.find((d) => d.id === device.id)) return prev;
	// 		return [...prev, device];
	// 	});
	// 	//bleService.stopScan();
	// 	//console.log(`setting device done!`)
	// }

	const startScan = async () => {
		const manager = managerRef.current;
		if (!manager) return;

		// Clear previous results
		setDevices([]);

		try {
			// On iOS you don't need to request runtime permission here (Info.plist required)
			// On Android you must request ACCESS_FINE_LOCATION / BLUETOOTH_SCAN depending on SDK level.
			//setIsScanning(true);
			manager.startDeviceScan([SERVICE_UUID], { allowDuplicates: false }, (error, scannedDevice) => {
				if (error) {
					Alert.alert('Scan error', `${error.message}`);
					return;
				}

				if (scannedDevice) {
					setDevices((prev) => {
						if (prev.find((d) => d.id === scannedDevice.id)) return prev;
						return [...prev, scannedDevice];
					});
				}

				stopScan();

			})

		} catch (e: any) {
			//console.warn('Failed to start scan', e);
			Alert.alert('Failed to start scan', e?.message ?? String(e));
			//setIsScanning(false);
		}
	};

	const stopScan = () => {
		const manager = managerRef.current;
		try {
			manager?.stopDeviceScan();
		} catch (e) {
			console.warn('stopScan error', e);
		}
		//setIsScanning(false);
	};

	return (
		<View className="px-4">
			{/* Card for device status (contains combobox) */}
			<MainDeviceStatus
				deviceId={deviceId}
				setOpen={() => setOpen(true)}
				managerRef={managerRef}
			>
			</MainDeviceStatus>

			{/* Modal for selecting device */}
			<Modal
				visible={open}
				animationType="fade"
				transparent
				onRequestClose={() => setOpen(false)}
			>
				<Pressable
					style={{ flex: 1 }}
					onPressOut={() => setOpen(false)}
					className="bg-black/30 justify-end"
				>
					<View className="bg-white rounded-t-2xl p-4">
						<Text className="text-gray-700 font-semibold mb-3">Select device</Text>

						<FlatList
							data={devices}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => (
								<Pressable
									onPress={() => {
										setSelectedDevice(item.id);
										setOpen(false);
									}}
									className="px-3 py-3 rounded-xl mb-2"
								>
									<View className="flex-row items-center">
										{/* <View className={`w-2 h-2 rounded-full bg-${item.color}-500 mr-2`} /> */}
										<Text className="text-gray-700">{item.name}</Text>
										<View className="w-4" />
										{item.id === deviceId ? (
											<Ionicons className="ml-auto text-base" name="checkmark" size={15} color="gray" />
										) : null}
									</View>
								</Pressable>
							)}
						/>
						<Pressable
							onPress={() => setOpen(false)}
							className="mt-2 py-3 items-center rounded-xl bg-gray-100"
						>
							<Text className="text-gray-700">Cancel</Text>
						</Pressable>
					</View>
				</Pressable>
			</Modal>
		</View>
	)
}

export default MainDeviceList;
