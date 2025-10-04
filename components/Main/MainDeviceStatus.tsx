import { styled } from "nativewind";
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colorMap, colorMapBg, type ColorVariant } from '../../model/DotStatusColor';
import { BleManager, Device } from "react-native-ble-plx";
import { KrossDevice } from '../../ble/KrossDevice';
import { useEffect, useState } from "react";

//const Icon = styled(Ionicons);

type StatusDevice = {
	id: string;
	name: string | null;
	status: string | null;
	battery: number | null;
	color: string;
};

const MainDeviceStatus = ({ device, setOpen, managerRef, }: { device: Device | undefined, setOpen: any, managerRef: React.RefObject<BleManager | null> }) => {

	const SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
	const DATA_OUT_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
	const krossDevice = new KrossDevice();
	//const [isConnected, setIsConnected] = useState(false);
	const [dv, setDevice] = useState<StatusDevice>();

	console.log(`MainDeviceStatus render!`)

	useEffect(() => {
		connectToDevice();
	}, []);

	const connectToDevice = async () => {
		try {
			const connected = await managerRef.current?.connectToDevice(device ? device.id : "", { autoConnect: true });
			if (!connected) {
				//Alert.alert('Connect error', `No connected device: `);
				console.log(`MainDeviceStatus -- Connect error No connected device: ${device ? device.id : ""}`);
				return;
			}

			await connected.discoverAllServicesAndCharacteristics();
			const subscription = await connected.monitorCharacteristicForService(
				SERVICE_UUID,
				DATA_OUT_UUID,
				(error, char) => {
					if (error) {
						//console.error("Notification error:", error);
						return;
					}

					console.log(`MainDeviceStatus - connectToDevice - monitorCharacteristicForService`)

					let data = krossDevice.onDataReceived(KrossDevice.decodeBase64(char?.value ?? ""));
					if (data) {
						krossDevice.unpack(data);
						setDevice({
							id: "",
							battery: krossDevice.soc,
							name: krossDevice.name,
							status: "Available",
							color: (1 == 1) ? "red" : "blue"
						});
						subscription.remove();
					} else {
						// console.log("Received data is null");
					}
				}
			);

		} catch (e: any) {
			Alert.alert('connect error', e?.message ?? String(e));
		}
	};

	const color: ColorVariant = "green";
	const colorbg: ColorVariant = "green";

	return (
		<View className="bg-white rounded-2xl p-4 shadow">
			<View className="flex-row items-center space-x-2 mb-2">
				<Text className="text-gray-700 font-semibold">Device Status</Text>
				<View className="w-20"></View>
				<View className="flex-row justify-end items-center space-x-2">
					{/* Battery icon */}
					<Ionicons name="battery-half-outline" size={18} />
					<Text className="font-medium">{dv?.battery}</Text>
					{/* <Text className={`${colorMap[dv?.color]} font-medium`}>{dv?.battery}</Text> */}

					{/* Status dot */}
					{/* <View className={`w-2.5 h-2.5 rounded-full ${colorMapBg[colorbg]} ml-2`} /> */}
					{/* <Text className={`text-${devices.color}-600 font-medium`}>{devices.status}</Text> */}
					<Text className="text--600 font-medium">{dv?.status}</Text>
				</View>
			</View>

			{/* Combobox row */}
			<Pressable
				onPress={() => setOpen(true)}
				className="flex-row items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
			>
				<View className="flex-row items-center">
					{/* green dot */}
					{/* <View className={`w-3 h-3 rounded-full ${colorMapBg[colorbg]} mr-3`} /> */}
					<Text className="text-gray-700">{dv?.name}</Text>
				</View>

				<Text className="text-gray-400">
					<Ionicons name="chevron-down" size={15} color="gray" />
				</Text>
			</Pressable>
		</View>
	)
}

export default MainDeviceStatus