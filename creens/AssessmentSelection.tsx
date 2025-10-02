import { useState, useLayoutEffect, useRef } from "react";
import { useNavigation } from '@react-navigation/native';
import {
	View,
	Text,
	Pressable,
	TouchableOpacity,
	ScrollView,
	FlatList,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { RotateCcw, PenLine, CircleCheckBig, Clock } from 'lucide-react-native'
import { styled } from 'nativewind';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../model/RootStackParamList";
import { useDispatch } from "react-redux";
import { resetROM } from "../store/redux/rangeOfMotionSlice"
import AssessmentTitle from "../components/AssessmentSelection/AssessmentTitle";
import { ChildInputRef } from "../model/ChildRefGetValue";

const LuRotateCcw = styled(RotateCcw);
const LuPenLine = styled(PenLine);
const LuCircleCheckBig = styled(CircleCheckBig);
const LuClock = styled(Clock);

type Feature = {
	id: string;
	text: string;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const romFeatures: Feature[] = [
	{ id: 'f1', text: 'Flexion/Extension measurement' },
	{ id: 'f2', text: 'Left/Right rotation tracking' },
	{ id: 'f3', text: 'Lateral flexion analysis' },
	{ id: 'f4', text: 'Symmetry and smoothness metrics' },
];

const AssessmentSelection = () => {
	const navigation = useNavigation<NavigationProp>();
	const dispatch = useDispatch();
	const [title, setTitle] = useState('');
	const titleRef = useRef<ChildInputRef>(null);

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

	//console.log(`AssessmentSelection render!`)

	const onPressGotoAssessment = () => {
		dispatch(resetROM());
		const title = titleRef.current?.getValue() || "";
		navigation.replace("RangeOfMotion", { title: title })
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
						<View className="flex-row items-center gap-2">
							<LuClock size={15} className="text-xs" color="gray"></LuClock>
							<Text className="text-xs text-gray-500 text-muted">Duration: ~10-12 minutes</Text>
						</View>
					</View>
				</View>

				{/* Additional spacing or other cards could go here */}
			</View>
		</ScrollView >
	);
}

export default AssessmentSelection