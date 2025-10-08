import { styled } from "nativewind";
import { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Feather } from "@expo/vector-icons";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../model/RootStackParamList';
import { BLEService } from "../ble/BLEService";
import { KrossDevice } from "../ble/KrossDevice";

type NavigationProp = StackNavigationProp<RootStackParamList>;
const FtherIcon = styled(Feather);

type SettingsDeviceProps = {
	deviceName?: string;
	deviceState?: string;
	firmwareVersion?: string;
};

const SettingsDevice = () => {
	const navigation = useNavigation<NavigationProp>();
	const [deviceInfo, setDeviceInfo] = useState<SettingsDeviceProps>()
	const krossDevice = new KrossDevice();

	const onPressGotoDeviceCalibration = () => {
		navigation.replace("DeviceCalibration")
	}

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "Settings",
			headerTitleAlign: "left",
			headerLeft: () => (
				<Pressable
					onPress={() => navigation.replace("Main")}
					className="flex-row items-center"
				>
					<FtherIcon className="ml-5" name="arrow-left" size={20} color="gray" />
					<Text className="text-xl ml-2"></Text>
				</Pressable>
			),
			// headerRight: () => (
			// 	<View className="flex-row items-center justify-center mb-1 mr-8">
			// 		<TouchableOpacity
			// 			onPress={reSet}
			// 			className="bg-white px-4 py-2 rounded-xl border border-gray-300"
			// 		>
			// 			<Text className="text-gray-800 text-center">
			// 				Reset
			// 			</Text>
			// 		</TouchableOpacity >
			// 	</View>
			// ),
		});
	}, [navigation]);

	useEffect(() => {

		const fetchDeviceName = async () => {
			const device = await BLEService.getDevice();
			if (!device) {
				return;
			}

			let deviceInfo: SettingsDeviceProps = {
				deviceName: device.name ?? "Unknown Device",
				firmwareVersion: "",
			};

			await device.isConnected().then((isConnected) => {
				deviceInfo.deviceState = isConnected ? "Device Connected" : "No Device Connected";
			});

			await BLEService.discoverAllServicesAndCharacteristicsForDevice();
			let char = await BLEService.readCharacteristicForDevice(BLEService.DEVICE_INFORMATION_SERVICE_UUID, BLEService.FIRMWARE_REVISION_UUID);
			if (char?.value) {
				deviceInfo.firmwareVersion = KrossDevice.decodeFirmwareVersion(char?.value);
			}

			setDeviceInfo(deviceInfo);
		};

		const connectDevice = async () => {
			if (BLEService.getDevice() == null) {
				await BLEService.scanDevices((device) => {
					BLEService.connectToDevice(device.id);
				}, [BLEService.SERVICE_UUID]);
			} else {
				await BLEService.connectToDevice(BLEService.getDevice()!.id);
			}
		}

		const settingInitial = async () => {
			await connectDevice();
			await fetchDeviceName();
		}

		settingInitial();

	}, []);

	// const reSet = async () => {
	// 	if (BLEService.getDevice() == null) {
	// 		Alert.alert('Connect error', `No connected device: `);
	// 		return;
	// 	}

	// 	try {
	// 		console.log('Setting Device is pack --- RESET_QUATERNION');
	// 		await BLEService.discoverAllServicesAndCharacteristicsForDevice();
	// 		BLEService.writeCharacteristicWithoutResponseForDevice(
	// 			BLEService.SERVICE_UUID,
	// 			BLEService.DATA_IN_UUID,
	// 			KrossDevice.encodeCmd(krossDevice.pack(KrossDevice.Cmd.RESET_QUATERNION))
	// 		);
	// 	} catch (e: any) {
	// 		//Alert.alert('connect error', e?.message ?? String(e));
	// 	}
	// };

	return (
		<ScrollView className="flex-1 bg-gray-50 p-4">
			{/* Device Calibration */}
			<View className="bg-white rounded-2xl p-4 mb-4 shadow">
				<View className="flex-row items-center mb-5">
					<FtherIcon className="mr-1" name="rotate-ccw" size={15} color="#1976D2" />
					<Text className="text-base font-semibold">
						Device Calibration
					</Text>
				</View>

				<View className="flex-row items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
					<View>
						<Text className="text-green-700 font-bold">{deviceInfo?.deviceState}</Text>
						<Text className="text-sm text-green-500">{deviceInfo?.deviceName}</Text>
					</View>
					<Pressable
						onPress={onPressGotoDeviceCalibration}
					// className={({ pressed }: any) => [
					// 	(pressed) ? "bg-green-500" : "bg-red-500"
					// ]}
					>
						<View className="flex-row items-center bg-blue-500 px-4 py-2 rounded-xl">
							<FtherIcon className="mr-2" name="rotate-ccw" size={15} color="white" />
							<Text className="text-white font-medium">
								Calibrate
							</Text>
						</View>
					</Pressable>
				</View>

				<Text className="mt-3 text-xs text-gray-500">
					Run calibration before each patient session for optimal accuracy.
				</Text>
			</View>

			{/* System Information */}
			<View className="bg-white rounded-2xl p-4 shadow">
				<Text className="text-base font-semibold mb-3">System Information</Text>

				<View className="flex-row flex-wrap">
					<View className="w-1/2 p-2">
						<View className="h-10">
							<Text className="text-xs text-muted-foreground">App Version</Text>
							<Text className="font-mono text-sm">v2.1.3</Text>
						</View>
					</View>
					<View className="w-1/2 p-2">
						<View className="h-10">
							<Text className="text-xs text-muted-foreground">Device Firmware</Text>
							<Text className="font-mono text-sm">{deviceInfo?.firmwareVersion}</Text>
						</View>
					</View>
					<View className="w-1/2 p-2">
						<View className="h-10">
							<Text className="text-xs text-muted-foreground">Last Sync</Text>
							<Text className="font-mono text-sm">2 minutes ago</Text>
						</View>
					</View>
					<View className="w-1/2 p-2">
						<View className="h-10">
							<Text className="text-xs text-muted-foreground">Storage Used</Text>
							<Text className="font-mono text-sm">2.3 GB/16 GB</Text>
						</View>
					</View>
				</View>

				<View className="mt-4 border-t border-gray-200 pt-3 space-y-1">
					<Text className="text-xs text-gray-500">
						Support: support@headx.co.uk
					</Text>
					<Text className="text-xs text-gray-500">
						Documentation: headx.co.uk/docs
					</Text>
					<Text className="text-xs text-gray-500">
						License: Commercial - Clinic License
					</Text>
				</View>
			</View>
		</ScrollView >
	)
}

export default SettingsDevice