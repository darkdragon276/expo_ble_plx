import { styled } from "nativewind";
import { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Feather } from "@expo/vector-icons";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../model/RootStackParamList';
import useConvertDateTime from "../utils/convertDateTime";
import { BLEService } from "../ble/BLEService";

type NavigationProp = StackNavigationProp<RootStackParamList>;
const FtherIcon = styled(Feather);

type SettingsDeviceProps = {
	deviceName?: string;
	isConnected: boolean;
	deviceState?: string;
	firmwareVersion?: string;
	lastSync?: number;
	storageUsed?: string;
};

const CalibrateButton = ({ isConnected }: { isConnected: boolean }) => {
	return (
		isConnected ?
			<View className={`flex-row items-center bg-blue-500 px-4 py-2 rounded-xl`}>
				<FtherIcon className="mr-2" name="rotate-ccw" size={15} color="white" />
				<Text className="text-white font-medium">
					Calibrate
				</Text>
			</View>
			:
			<View className={`flex-row items-center bg-gray-500 px-4 py-2 rounded-xl`}>
				<FtherIcon className="mr-2" name="rotate-ccw" size={15} color="white" />
				<Text className="text-white font-medium">
					Calibrate
				</Text>
			</View>
	)
}

const SettingsDevice = () => {
	const navigation = useNavigation<NavigationProp>();
	const [deviceInfo, setDeviceInfo] = useState<SettingsDeviceProps>();

	const onPressGotoDeviceCalibration = async () => {
		if (deviceInfo?.isConnected === true) {
			navigation.replace("DeviceCalibration")
		}
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
		//const dt: Date = Date.now() - (BLEService.deviceSupportInfo?.lastSync ?? 0);

		//const { lastSync, hours, minutes, seconds } = useConvertDateTime(dt);

		let deviceInfo: SettingsDeviceProps = {
			deviceName: BLEService.deviceSupportInfo?.name ?? "Unknown Device",
			firmwareVersion: BLEService.deviceSupportInfo?.firmwareVersion ?? "",
			deviceState: BLEService.isDeviceVisible() ? "Device Connected" : "No Device Connected",
			isConnected: BLEService.isDeviceVisible(),
			lastSync: Date.now() - (BLEService.deviceSupportInfo?.lastSync ?? 0),
			storageUsed: "2.3 GB/16 GB",
		};

		setDeviceInfo(deviceInfo);

		return () => {
			//clearInterval(STDcyclingIntervalId);
		};
	}, []);

	// const STDcyclingIntervalId = setInterval(() => {
	// 	if (!BLEService.isDeviceVisible()) {
	// 		let deviceInfo: SettingsDeviceProps = {
	// 			deviceName: "Unknown Device",
	// 			firmwareVersion: "",
	// 			deviceState: "No Device Connected",
	// 			isConnected: false,
	// 		};
	// 		setDeviceInfo(deviceInfo);
	// 	}

	// }, 2000);

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

				<View className={`flex-row items-center justify-between ${deviceInfo?.isConnected ? "bg-green-100" : "bg-red-100"} border ${deviceInfo?.isConnected ? "border-green-200" : "border-red-100"} rounded-xl p-3`}>
					<View>
						<Text className={`text-${deviceInfo?.isConnected ? "green-700" : "red-500"} font-bold`}>{deviceInfo?.deviceState}</Text>
						<Text className={`text-sm text-${deviceInfo?.isConnected ? "green" : "red"}-500`}>{deviceInfo?.deviceName}</Text>
					</View>
					<Pressable onPress={onPressGotoDeviceCalibration}>
						<CalibrateButton isConnected={deviceInfo?.isConnected ?? false} />
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
							<Text className="font-mono text-sm">{deviceInfo?.lastSync ?? ""}</Text>
						</View>
					</View>
					<View className="w-1/2 p-2">
						<View className="h-10">
							<Text className="text-xs text-muted-foreground">Storage Used</Text>
							<Text className="font-mono text-sm">{deviceInfo?.storageUsed ?? ""}</Text>
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