import { useState, useLayoutEffect, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import {
	View,
	Text,
	Pressable,
	TouchableOpacity,
	ScrollView,
	Image,
} from "react-native";

// import LinearGradient from "react-native-linear-gradient";
import { LinearGradient } from "expo-linear-gradient";
import { LucidePlay, LucideSquare, LucideUsers } from 'lucide-react-native'
import { Ionicons } from "@expo/vector-icons";
import { styled } from 'nativewind';
import { RootStackParamList } from "../model/RootStackParamList";
import { StackNavigationProp } from "@react-navigation/stack";
import AssessmentCardExtension from "../components/RangeOfMotion/AssessmentExtension";
import AssessmentFlexion from "../components/RangeOfMotion/AssessmentFlexion";
import AssessmentLRotation from "../components/RangeOfMotion/AssessmentLRotation";
import AssessmentRRotation from "../components/RangeOfMotion/AssessmentRRotation";
import AssessmentLLateral from "../components/RangeOfMotion/AssessmentLLateral";
import AssessmentRLateral from "../components/RangeOfMotion/AssessmentRLateral";
// import { useDatabase } from "../db/useDatabase";
// import { DB_INSERT_ROM, DB_SELECT_ALL_ROM } from "../db/dbQuery";
// import useGetMotions from "..//hooks//rangeOfMotionHook/useGetMotions";
// import { useDispatch, useSelector } from "react-redux";
// import { IRootState } from "../model/IRootState";
// import useColectROM from "../hooks/rangeOfMotionHook/useColectROM";

const LuPlay = styled(LucidePlay);
const LuUsers = styled(LucideUsers);
const LuSquare = styled(LucideSquare);

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ExtensionSrcImage = require("../assets/Extension.png");
const FlexionSrcImage = require("../assets/Flexion.png");
const LeftRotationSrcImage = require("../assets/LeftRotation.png");
const RightRotationSrcImage = require("../assets/RightRotation.png");
const LeftLateralSrcImage = require("../assets/LeftLateral.png");
const RightLateralSrcImage = require("../assets/RightLateral.png");

const RangeOfMotion = () => {
	const navigation = useNavigation<NavigationProp>();
	const [record, setRecord] = useState(false);
	// const db = useDatabase("headx.db");
	// const { extension, flexion, l_rotation, r_rotation, l_lateral, r_lateral, duration } = useGetMotions();
	// const extension1 = useSelector((state: IRootState) => state.rangeOfMotion.extension)

	// useLayoutEffect(() => {
	// 	console.log(`RangeOfMotion - useLayoutEffect`)
	// 	navigation.setOptions({
	// 		title: "",
	// 		headerTitleAlign: "left",
	// 		headerStyle: {
	// 			elevation: 0,
	// 			shadowOpacity: 0,
	// 			borderBottomWidth: 0,
	// 		},
	// 		headerLeft: () => (
	// 			<View className="flex-row items-center">
	// 				<Pressable
	// 					onPress={() => navigation.goBack()}
	// 					className="flex-row items-center bg-gray-100 px-3 py-1 rounded-lg"
	// 				>
	// 					<Ionicons name="arrow-back" size={18} color="black" />
	// 					<Text className="ml-1 text-sm font-medium">Back</Text>
	// 				</Pressable>
	// 			</View>
	// 		),
	// 		headerRight: () => {
	// 			return record
	// 				?
	// 				<View className="flex-row items-center px-3 py-1 rounded-full bg-red-100 border border-red-300 mr-2">
	// 					<View className="w-2.5 h-2.5 rounded-full bg-red-600 mr-2" />
	// 					<Text className="text-red-600 font-medium"> Recording</Text>
	// 				</View>
	// 				:
	// 				<></>;
	// 		}
	// 	});
	// }, [navigation, record]);

	// useEffect(() => {

	// }, [])

	// const addData = async () => {
	// 	console.log("DB_INSERT_ROM start!");

	// 	if (!db) {
	// 		console.log("addData db is null !");
	// 		return;
	// 	}

	// 	console.log("addData go");

	// 	console.log(extension);
	// 	console.log(extension1);
	// 	console.log("begin INSERT!");
	// 	//db.execAsync(DB_INSERT_ROM, ["", 1, 2, 3, 4, 5, 6, 7]);
	// 	await db.runAsync(DB_INSERT_ROM, ["", extension, flexion, l_rotation, r_rotation, l_lateral, r_lateral, duration]);
	// 	console.log("INSERT done!");
	// 	console.log("DB_INSERT_ROM inserted!");
	// };

	// const selectData = async () => {
	// 	if (!db) return;

	// 	const result = await db.getAllAsync(DB_SELECT_ALL_ROM);
	// 	console.log("Users:", result);
	// };

	const onPressRecording = () => {
		//selectData();
		setRecord(true)
	};

	const onPressStopRecor = () => {
		setRecord(false)
		setTimeout(() => {
			// addData().then((res) => {

			// });
			navigation.navigate("RangeOfMotionSummary")
		}, 500);
	};

	return (
		<ScrollView className="flex-1 p-4 space-y-6">
			<View className="items-center">
				<Text className="text-lg font-semibold mb-1">
					Range of Motion Assessment
				</Text>
				<Text className="text-sm text-gray-500 text-center">
					Live data capture from all cervical movements
				</Text>
			</View>

			<View className="flex-1 space-y-6">
				{/* Card Instructions */}
				<View className="bg-blue-50 rounded-xl px-4 py-3 shadow-sm">
					{/* Header */}
					<View className="flex-row items-center justify-center">
						{/* Small icon */}
						<LuUsers size={20}></LuUsers>
						<Text className="ml-2 font-semibold text-blue-700">Instructions</Text>
					</View>

					{/* List Steps */}
					<View className="space-y-2">
						<View className="flex-row items-start">
							<Text className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold text-center mr-2">
								1
							</Text>
							<Text className="flex-1 text-sm text-blue-700">
								Position patient seated, looking straight ahead
							</Text>
						</View>

						<View className="flex-row items-start">
							<Text className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold text-center mr-2">
								2
							</Text>
							<Text className="flex-1 text-sm text-blue-700">
								Start recording and guide through all 6 movements
							</Text>
						</View>

						<View className="flex-row items-start">
							<Text className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold text-center mr-2">
								3
							</Text>
							<Text className="flex-1 text-sm text-blue-700">
								Stop recording when complete to view results
							</Text>
						</View>
					</View>
				</View>

				{/* Start Assessment Button */}
				<View className="flex-row items-center justify-center rounded-xl bg-white p-4">
					{
						!record
							?
							<TouchableOpacity
								onPress={onPressRecording}
								activeOpacity={0.9} className="rounded-xl overflow-hidden shadow">
								<LinearGradient
									colors={["#0a66ff", "#00a3ff"]}
									start={[0, 0]}
									end={[1, 0]}
									className="flex-row items-center justify-center w-full py-4 px-12"
								>
									<LuPlay size={20} color="white"></LuPlay>
									<Text className="text-white font-semibold ml-2 p-3">Start Assessment</Text>
								</LinearGradient>
							</TouchableOpacity>
							:
							<TouchableOpacity
								onPress={onPressStopRecor}
								activeOpacity={0.9} className="rounded-xl overflow-hidden shadow">
								<LinearGradient
									colors={["#B91C1C", "#B91C1C"]}
									start={[0, 0]}
									end={[1, 0]}
									className="flex-row bg-red-700 items-center justify-center w-full py-4 px-12"
								>
									<LuSquare size={20} color="white"></LuSquare>
									<Text className="text-white font-semibold ml-2 p-3">Stop Recording</Text>
								</LinearGradient>
							</TouchableOpacity>
					}
				</View>
			</View>

			<View className="flex-row flex-wrap">
				<View className="w-1/2 p-2">
					<View className="bg-blue-50/80 border border-blue-300 rounded-xl p-3">
						{/* Title */}
						<Text className="font-semibold text-gray-800 mb-1">Extension</Text>
						{/* Icon + description */}
						<View className="items-center">
							<Image
								className="w-14 h-14"
								source={ExtensionSrcImage}
							/>
						</View>
						<AssessmentCardExtension record={record}></AssessmentCardExtension>
					</View>
				</View>

				<View className="w-1/2 p-2">
					<View className="bg-green-50/80 border border-green-300 rounded-xl p-3">
						{/* Title */}
						<Text className="font-semibold text-gray-800 mb-1">Flexion</Text>

						{/* Icon + description */}
						<View className="items-center">
							<Image
								className="w-14 h-14"
								source={FlexionSrcImage}
							/>
						</View>
						<AssessmentFlexion record={record}></AssessmentFlexion>
					</View>
				</View>

				<View className="w-1/2 p-2">
					<View className="bg-purple-50/80 border border-purple-300 rounded-xl p-3">
						{/* Title */}
						<Text className="font-semibold text-gray-800 mb-1">Left Rotation</Text>

						{/* Icon + description */}
						<View className="items-center">
							<Image
								className="w-14 h-14"
								source={LeftRotationSrcImage}
							/>
						</View>
						<AssessmentRRotation record={record}></AssessmentRRotation>
					</View>
				</View>

				<View className="w-1/2 p-2">
					<View className="bg-orange-50/80 border border-orange-300 rounded-xl p-3">
						{/* Title */}
						<Text className="font-semibold text-gray-800 mb-1">Right Rotation</Text>

						{/* Icon + description */}
						<View className="items-center">
							<Image
								className="w-14 h-14"
								source={RightRotationSrcImage}
							/>
						</View>
						<AssessmentRLateral record={record}></AssessmentRLateral>
					</View>
				</View>

				<View className="w-1/2 p-2">
					<View className="bg-teal-50/80 border border-teal-300 rounded-xl p-3">
						{/* Title */}
						<Text className="font-semibold text-gray-800 mb-1">Left Lateral</Text>

						{/* Icon + description */}
						<View className="items-center">
							<Image
								className="w-14 h-14"
								source={LeftLateralSrcImage}
							/>
						</View>
						<AssessmentLRotation record={record}></AssessmentLRotation>
					</View>
				</View>

				<View className="w-1/2 p-2">
					<View className="bg-pink-50/80 border border-pink-300 rounded-xl p-3">
						{/* Title */}
						<Text className="font-semibold text-gray-800 mb-1">Right Lateral</Text>

						{/* Icon + description */}
						<View className="items-center">
							<Image
								className="w-14 h-14"
								source={RightLateralSrcImage}
							/>
						</View>
						<AssessmentLLateral record={record}></AssessmentLLateral>
					</View>

				</View>
			</View>
		</ScrollView>
	)
}

export default RangeOfMotion