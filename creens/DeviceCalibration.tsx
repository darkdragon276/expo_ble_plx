import { useState, useLayoutEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import CalibrationsReady from "../components/DeviceCalibration/CalibrationsReady";
import CalibrationsProgress from "../components/DeviceCalibration/CalibrationsProgress";
import {
	View,
	Text,
	Pressable,
	Animated,
	ScrollView,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from "../model/RootStackParamList";
import { StackNavigationProp } from "@react-navigation/stack";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function DeviceCalibration() {
	const navigation = useNavigation<NavigationProp>();
	const [pressStartProgress, setPressStartProgress] = useState(false)

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "",
			headerTitleAlign: "left",
			headerStyle: {
				elevation: 0,
				shadowOpacity: 0,
				borderBottomWidth: 0,
			},
			headerLeft: () => (
				<View className="flex-row items-center">
					<Pressable
						onPress={() => navigation.replace("SettingsDevice")}
						className="flex-row items-center bg-gray-100 px-3 py-1 rounded-lg"
					>
						<Ionicons name="arrow-back" size={18} color="black" />
						<Text className="ml-1 text-sm font-medium">Back</Text>
					</Pressable>
				</View>
			),
		});
	}, [navigation]);

	return (
		<ScrollView className="flex-1 bg-gray-50 p-4">
			<View className="items-center mb-4">
				<View className="bg-blue-100 px-3 py-1 rounded-full">
					<Text className="text-blue-600 font-medium text-xs">
						Step 2 of 2
					</Text>
				</View>
			</View>

			{/* Title + Subtitle */}
			<View className="items-center mb-6">
				<Text className="text-lg font-semibold mb-1">
					Device Calibration
				</Text>
				<Text className="text-sm text-gray-500 text-center">
					Preparing your HeadX device for precise assessment
				</Text>
			</View>

			<View className="bg-white rounded-2xl p-4 shadow">
				<View>
					<Text className="text-lg font-semibold">
						Calibration Progress
					</Text>
				</View>
				{
					pressStartProgress
						?
						<CalibrationsProgress>
						</CalibrationsProgress>
						:
						<CalibrationsReady
							runProgress={setPressStartProgress}
						>
						</CalibrationsReady>
				}
			</View>
		</ScrollView >
	);
}
