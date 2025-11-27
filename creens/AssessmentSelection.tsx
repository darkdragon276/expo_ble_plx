import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import {
	View,
	Text,
	Pressable,
	TouchableOpacity,
	ScrollView,
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
				// Alert.alert('No device connected', `Please connect device from Dashboard`, [
				// 	{
				// 		text: 'OK',
				// 		onPress: () => navigation.replace("Main"),
				// 	}
				// ]);
				// return;
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

	const renderFeature = ({ item }: { item: Feature }) => (
		<View className="flex-row items-start gap-3 my-1">
			<LuCircleCheckBig size={15} className="font-semibold text-green-500"></LuCircleCheckBig>
			<Text className="text-sm text-muted">{item.text}</Text>
		</View>
	);

	const onPressGotoAssessment = () => {
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
					<Text className="text-lg font-semibold mb-1">
						Assessment Selection
					</Text>
					<Text className="text-sm text-gray-500 text-center">
						Choose an assessment type
					</Text>
				</View>

				{/* Session name input */}
				<View className="flex-row items-center bg-white rounded-xl px-3 py-2 mb-6 shadow">
					<LuPenLine size={20} className="text-blue-500"></LuPenLine>
					{/* <TextInput
						value={title}
						onChangeText={setTitle}
						placeholder="Session Name (Optional)"
						placeholderTextColor="black"
						className="w-full rounded-xl px-4 py-4 text-base"
					/> */}
					<AssessmentTitle
						ref={titleRef}
					></AssessmentTitle>
				</View>

				{/* ROM Card */}
				<View className="bg-white rounded-xl p-5 shadow-md">
					<View className="flex-row items-center">
						{/* Icon circle */}
						<View className="w-12 h-12 rounded-xl bg-blue-200 items-center justify-center mr-3">
							{/* small rotation icon */}
							<LuRotateCcw size={22} className="text-blue-500"></LuRotateCcw>
						</View>
						<Text className="text-xl">Range of Motion (ROM)</Text>

					</View>

					{/* Start button */}
					<View className="mt-5">
						<TouchableOpacity
							onPress={onPressGotoAssessment}
							className="rounded-lg overflow-hidden"
							activeOpacity={0.9}>
							<LinearGradient
								colors={['#0a66ff', '#0066ff']}
								start={[0, 0]}
								end={[1, 0]}
								className="rounded-lg"
								style={{ paddingVertical: 14, alignItems: 'center' }}
							>

								<View className="flex-row items-center gap-2">
									<LuRotateCcw size={18} className="" color="white"></LuRotateCcw>
									<Text className="text-white font-semibold">Start ROM Assessment</Text>
								</View>
							</LinearGradient>
						</TouchableOpacity>
					</View>

					<View className="flex-1 py-2">
						<Text className="text-md text-gray-400 mt-1">
							Assess cervical spine mobility across all planes of movement with real-time visualization and precise angular measurements.
						</Text>
					</View>

					{/* Features list */}
					<View className="space-y-3">
						<FlatList
							data={romFeatures}
							keyExtractor={(i) => i.id}
							renderItem={renderFeature}
							scrollEnabled={false}
						/>
						{/* <View className="flex-row items-center gap-2">
							<LuClock size={15} className="text-xs" color="gray"></LuClock>
							<Text className="text-xs text-gray-500 text-muted">Duration: ~10-12 minutes</Text>
						</View> */}
					</View>
				</View>

				{/* JPS Card */}
				<View className="bg-white rounded-xl p-5 shadow-md mt-5">
					<View className="flex-row items-center">
						{/* Icon circle */}
						<View className="w-12 h-12 rounded-xl bg-gray-200 items-center justify-center mr-3">
							{/* small rotation icon */}
							<LuTarget size={22} className="text-gray-500"></LuTarget>
						</View>
						<Text className="text-xl">Joint Position Sense (JPS)</Text>

					</View>

					{/* Start button */}
					<View className="mt-5">
						<TouchableOpacity
							onPress={onPressGotoJPS}
							className="rounded-lg overflow-hidden"
							activeOpacity={0.9}>
							<LinearGradient
								colors={['#45556c', '#45556c']}
								start={[0, 0]}
								end={[1, 0]}
								className="rounded-lg"
								style={{ paddingVertical: 14, alignItems: 'center' }}
							>

								<View className="flex-row items-center gap-2">
									<LuRotateCcw size={18} className="" color="white"></LuRotateCcw>
									<Text className="text-white font-semibold">Start JPS Assessment</Text>
								</View>
							</LinearGradient>
						</TouchableOpacity>
					</View>

					<View className="flex-1 py-2">
						<Text className="text-md text-gray-400 mt-1">
							Evaluate proprioceptive accuracy by measuring the patient's ability to return to target positions with eyes closed.
						</Text>
					</View>

					{/* Features list */}
					<View className="space-y-3">
						<FlatList
							data={jpsFeatures}
							keyExtractor={(i) => i.id}
							renderItem={renderFeature}
							scrollEnabled={false}
						/>
						{/* <View className="flex-row items-center gap-2">
							<LuClock size={15} className="text-xs" color="gray"></LuClock>
							<Text className="text-xs text-gray-500 text-muted">Duration: ~10-12 minutes</Text>
						</View> */}
					</View>
				</View>

				<View className="bg-white p-4 rounded-xl shadow mt-4">
					<View className="flex-row items-center mb-3">
						<View className="w-10 h-10 rounded-xl bg-blue-200 items-center justify-center mr-4">
							<LuCircleCheckBig size={20} className="text-blue-500"></LuCircleCheckBig>
						</View>
						<Text className="mb-3 text-xl">Before You Begin</Text>
					</View>

					<View className="rounded-xl p-1 ml-10 ">
						<View className="flex-1 space-y-1">
							<Text className="text-xs text-muted-foreground space-y-1">• Ensure HeadX device is properly positioned</Text>
							<Text className="text-xs text-muted-foreground space-y-1">• Patient seated comfortably with good posture</Text>
							<Text className="text-xs text-muted-foreground space-y-1">• Device calibrated (Settings if needed)</Text>
							<Text className="text-xs text-muted-foreground space-y-1">• Results automatically saved</Text>
						</View>
					</View>
				</View>

				<View className="h-12"></View>
			</View>
		</ScrollView >
	);
}

export default AssessmentSelection