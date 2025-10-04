import { styled } from "nativewind";
import { Text, View, Pressable, Alert } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { colorMap, colorMapBg, type ColorVariant } from '../../model/DotStatusColor';
import { BleManager, Device } from "react-native-ble-plx";
import { KrossDevice } from '../../ble/KrossDevice';
import { useEffect, useState } from "react";
//import { BLEService } from "../../ble/BLEService";
// import bleService from '../../ble/BLEService';
import BLEManagerInstance from "../../ble/BLEManager";

const Icon = styled(Ionicons);

type StatusDevice = {
	id: string;
	name: string | null;
	status: string | null;
	battery: number | null;
	color: string;
};

const MainDeviceStatus = ({ deviceId, setOpen, managerRef, }: { deviceId: string, setOpen: any, managerRef: React.RefObject<BleManager | null> }) => {
	const SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
	const DATA_OUT_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
	const krossDevice = new KrossDevice();
	const [dvInfo, setDvInfo] = useState<StatusDevice>();
	const [localDeviceId, setLocalDeviceId] = useState<string>(deviceId);

	//console.log(`MainDeviceStatus render with deviceId! ${deviceId}`)
	
	useEffect(() => {
		console.log(`MainDeviceStatus useEffect render! ${deviceId}`)
		setLocalDeviceId(deviceId)
		connectToDevice(deviceId)
		//startConnectReadDevice(deviceId);
		// BLEService.initializeBLE().then(() => {
		// 	startConnectReadDevice(deviceId);
		// });

	}, [deviceId]);

	// const startConnectReadDevice = async (deviceId: string) => {

	// 	if (deviceId === "") {
	// 		return;
	// 	}

	// 	//await bleService.connectToDevice(deviceId);
	// };

	const connectToDevice = async (deviceId: string) => {
		//console.log(`MainDeviceStatus -- Run connectToDevice with deviceId: ${deviceId}`);
		try {
			
			if (deviceId === "") {
				return;
			}

			stopScan();
			const connected = await managerRef.current?.connectToDevice(deviceId, { autoConnect: true });
			if (!connected) {
				//Alert.alert('Connect error', `No connected device: `);
				//console.log(`MainDeviceStatus -- Connect error No connected device: ${deviceId}`);
				return;
			}

			const tranSactionID = "GET_STAGE_DEVICE";

			//console.log(`MainDeviceStatus -- Connect success: ${deviceId}`);

			await connected.discoverAllServicesAndCharacteristics();
			let subscription = connected.monitorCharacteristicForService(
				SERVICE_UUID,
				DATA_OUT_UUID,
				(error, char) => {
					if (error) {
						//console.error("Notification error:", error);
						return;
					}

					BLEManagerInstance.setUUID(deviceId);

					//onsole.log(`MainDeviceStatus - connectToDevice - monitorCharacteristicForService`)
					let data = krossDevice.onDataReceived(KrossDevice.decodeBase64(char?.value ?? ""));
					if (data) {
						krossDevice.unpack(data);

						setDvInfo((prev) => {
							if (prev?.battery === krossDevice.soc) return prev;
								return {
									id: "",
									battery: krossDevice.soc,
									name: connected.name, 
									status: "Connected",
									color: (krossDevice.soc >= 60)
											? 
												"green" 
											: 
												(krossDevice.soc > 25 && krossDevice.soc < 60) 
													? 
														"yellow" 
													: 
														"red",
								};
						});

						managerRef.current?.cancelTransaction(tranSactionID);

					} else {
					// 	// console.log("Received data is null");
					}
				},
				tranSactionID
			);
		} catch (e: any) {
			//Alert.alert('connect error', e?.message ?? String(e));
		}
	};

	const stopScan = () => {
		const manager = managerRef.current;
		try {
			manager?.stopDeviceScan();
		} catch (e) {
			//console.warn('stopScan error', e);
		}
	};

	// const color: ColorVariant = "green";
	// const colorbg: ColorVariant = "green";

	return (
		<View className="bg-white rounded-2xl p-4 shadow">
			<View className="flex-row items-center space-x-2 mb-2">
				<Text className="text-gray-700 font-semibold">Device Status</Text>
				<View className="w-20"></View>
				<View className="flex-row justify-end items-center space-x-2">
					{/* Battery icon */}
					{
						dvInfo && dvInfo?.battery
						?
						<View className="flex-row items-center space-x-2">
							<Icon name="battery-half-outline" className={`text-${dvInfo.color}-600`} size={18} />
							<Text className={`text-${dvInfo.color}-600`}>{dvInfo?.battery}%</Text>
							<View className="w-2.5 h-2.5 rounded-xl bg-green-500 ml-2" />
							<Text className="text-green-600 font-medium">{dvInfo?.status}</Text>
						</View>
						:
						<></>
					}
				</View>
			</View>

			{/* Combobox row */}
			<Pressable
				onPress={() => setOpen(true)}
				className="flex-row items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
			>
				<View className="flex-row items-center">
					{/* green dot */}
					{
						dvInfo && dvInfo?.battery
						?
						<>
							<View className="w-3 h-3 rounded-xl bg-green-500 mr-3" />
							<Text className="text-gray-700">{dvInfo?.name}</Text>
						</>
						:
						<></>
					}
				</View>

				<Text className="text-gray-400">
					<Ionicons name="chevron-down" size={15} color="gray" />
				</Text>
			</Pressable>
		</View>
	)
}

export default MainDeviceStatus