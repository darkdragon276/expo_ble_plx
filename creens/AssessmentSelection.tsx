import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import {
	View,
	Text,
	Pressable,
	TouchableOpacity,
	ScrollView,
	Image,
	FlatList,
	Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { RotateCcw, LucideTarget, PenLine, CircleCheckBig } from 'lucide-react-native'
import { styled } from 'nativewind';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../model/RootStackParamList";
import AssessmentTitle from "../components/AssessmentSelection/AssessmentTitle";
import { ChildInputRef } from "../model/ChildRefGetValue";
import { BLEService } from "../ble/BLEService";

const LuRotateCcw = styled(RotateCcw);
const LuPenLine = styled(PenLine);
const LuCircleCheckBig = styled(CircleCheckBig);
const LuTarget = styled(LucideTarget);

type Feature = {
	id: string;
	text: string;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const romFeatures: Feature[] = [
	{ id: 'f1', text: 'Flexion/Extension measurement' },
	{ id: 'f2', text: 'Left/Right rotation tracking' },
	{ id: 'f3', text: 'Lateral flexion analysis' },
	// { id: 'f4', text: 'Symmetry and smoothness metrics' },
];

const jpsFeatures: Feature[] = [
	{ id: 'f1', text: 'Neutral position targeting' },
	{ id: 'f2', text: 'Multiple target positions' },
	{ id: 'f3', text: 'Mean error calculation' },
	{ id: 'f4', text: 'Variability scoring' },
];

const AssessmentSelection = () => {
	const navigation = useNavigation<NavigationProp>();
	const [title, setTitle] = useState('');
	const titleRef = useRef<ChildInputRef>(null);

	useEffect(() => {

		const updateInfo2s = setInterval(() => {
			if (BLEService.deviceId === null) {
				clearInterval(updateInfo2s);
				Alert.alert('No device connected', `Please connect device from Dashboard`, [
					{
						text: 'OK',
						onPress: () => navigation.replace("Main"),
					}
				]);
				return;
			};
		}, 1000);

		return () => {
			clearInterval(updateInfo2s);
		};
	}, []);

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
						onPress={() => navigation.replace("Main")}
						className="flex-row items-center bg-gray-100 px-3 py-1 rounded-lg"
					>
						<Ionicons name="arrow-back" size={18} color="black" />
						<Text className="ml-1 text-sm font-medium">Back</Text>
					</Pressable>
				</View>
			),
		});
	}, [navigation]);

	const onPressGotoROM = () => {
		const title = titleRef.current?.getValue() || "";
		navigation.replace("RangeOfMotion", { title: title })
	}

	const onPressGotoJPS = () => {
		const title = titleRef.current?.getValue() || "";
		navigation.replace("JointPositionSense", { title: title })
	}

	return (
		<ScrollView className="flex-1 bg-gray-50 p-4">
			<View className="w-full">
				<View className="items-center mb-6">
					<Text className="text-xl font-semibold mb-1">
						Assessment Selection
					</Text>
					<Text className="text-sm text-gray-500 text-center">
						Choose an assessment type
					</Text>
				</View>

				{/* Session name input */}
				<View className="mb-6">
					<View className="flex-row items-center mb-2">
						<LuPenLine size={16} className="text-blue-500"></LuPenLine>
						<Text className="ml-2 text-sm font-regular text-black-700">Session Name (Optional)</Text>
					</View>
					<AssessmentTitle
						ref={titleRef}
					></AssessmentTitle>
				</View>

				<View className="flex-row justify-center gap-4 mb-6">
					<Pressable onPress={onPressGotoJPS} className="flex-1">
						{({ pressed }) => (
							<View
								className="border-2 border-blue-300 rounded-2xl p-4 items-center aspect-square justify-center"
								style={{ backgroundColor: pressed ? '#DBEAFE' : 'transparent' }}
							>
								<Text className="text-sm font-semibold text-gray-800 mb-3 text-center">
									Joint Position Sense
								</Text>

								<Image
									source={require("../assets/JPSIcon.png")}
									className="w-20 h-20"
									resizeMode="contain"
								/>
							</View>
						)}
					</Pressable>
					<Pressable onPress={onPressGotoROM} className="flex-1">
						{({ pressed }) => (
							<View
								className="border-2 border-purple-300 rounded-2xl p-4 items-center aspect-square justify-center"
								style={{ backgroundColor: pressed ? '#F3E8FF' : 'transparent' }}
							>
								<Text className="text-sm font-semibold text-gray-800 mb-3 text-center">
									Range of Motion
								</Text>

								<Image
									source={require("../assets/ROMIcon.png")}
									className="w-20 h-20"
									resizeMode="contain"
								/>
							</View>
						)}
					</Pressable>
				</View>
				{/* Instructions Box */}
				<View className="bg-white p-3 rounded-xl shadow mt-4">
					<View className="flex-row items-start gap-2">
						{/* Left column - Icon */}
						<View className="w-8 h-8 rounded-lg bg-blue-100 items-center justify-center mt-1 flex-shrink-0">
							<LuCircleCheckBig size={20} className="text-blue-500"></LuCircleCheckBig>
						</View>

						{/* Right column - Header and Details */}
						<View className="flex-1">
							<Text className="text-base font-semibold mb-3">Before You Begin</Text>
							<View className="">
								<Text className="text-sm text-gray-500">• Ensure HeadX device is properly positioned</Text>
								<Text className="text-sm text-gray-500">• Patient seated comfortably with good posture</Text>
								<Text className="text-sm text-gray-500">• Device calibrated (Settings if needed)</Text>
								<Text className="text-sm text-gray-500">• Results automatically saved</Text>
							</View>
						</View>
					</View>
				</View>

				<View className="h-12"></View>
			</View>
		</ScrollView >
	);
}

export default AssessmentSelection