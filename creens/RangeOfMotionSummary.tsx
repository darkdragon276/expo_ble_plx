import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
	View,
	Text,
	Pressable,
	Image,
	TouchableOpacity,
	ScrollView,
	TextInput,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { RotateCcw, PenLine, CircleAlert, ChartColumn, FileText } from 'lucide-react-native'
import { styled } from 'nativewind';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../model/RootStackParamList";
import { useDatabase } from "../db/useDatabase";
import { DB_SELECT_BY_ID_ROM } from "../db/dbQuery";

const LuRotateCcw = styled(RotateCcw);
const LuPenLine = styled(PenLine);
const LuCircleAlert = styled(CircleAlert);
const LuChartColumn = styled(ChartColumn);
const LuFileText = styled(FileText);

const ExtensionSrcImage = require("../assets/Extension.png");
const FlexionSrcImage = require("../assets/Flexion.png");
const LeftRotationSrcImage = require("../assets/LeftRotation.png");
const RightRotationSrcImage = require("../assets/RightRotation.png");
const LeftLateralSrcImage = require("../assets/LeftLateral.png");
const RightLateralSrcImage = require("../assets/RightLateral.png");

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RProp = RouteProp<RootStackParamList, "RangeOfMotionSummary">;

type DataProp = {
	key: string,
	date: string,
	title: string,
	time: string,
	extension: number,
	flexion: number,
	l_rotation: number,
	r_rotation: number,
	l_lateral: number,
	r_lateral: number,
	duration: number,
}

const RangeOfMotionSummary = () => {
	const navigation = useNavigation<NavigationProp>();
	const db = useDatabase("headx.db");
	const route = useRoute<RProp>();
	const [data, setData] = useState<DataProp | null>(null)

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
						onPress={onPressGotoMain}
						className="flex-row items-center bg-gray-100 px-3 py-1 rounded-lg"
					>
						<Ionicons name="arrow-back" size={18} color="black" />
						<Text className="ml-1 text-sm font-medium">Back</Text>
					</Pressable>
				</View>
			),
			headerRight: () => (
				<View className="flex-row items-center justify-center mb-1 mr-4">
					<Pressable
						onPress={() => { }}
						className="flex-row items-center bg-gray-100 px-3 py-1 rounded-lg"
					>
						<LuFileText size={18} color="black" />
						<Text className="ml-1 text-sm font-medium">Export PDF</Text>
					</Pressable >
				</View>
			)
		});
	}, [navigation]);

	//console.log(`RangeOfMotionSummary render!`)
	useEffect(() => {

		const selectData = async () => {
			try {
				//console.log(`RangeOfMotionSummary selectData running}`)
				if (!db) {
					//console.log(`db is null`);
					return;
				}

				const { key } = route.params;
				//console.log(`getFirstAsync ${key}`);
				const rs = await db.getFirstAsync<DataProp>(DB_SELECT_BY_ID_ROM, key); //"1759379091428"
				if (rs) {
					setData(rs);
					//console.log(rs);
				}
			} catch (error) {
				console.log(error);
			}
		};

		if (db) {
			selectData();
		}

	}, [db])

	const onPressGotoMain = useCallback(() => {
		navigation.replace("Main")
	}, []);

	return (
		<ScrollView className="flex-1 bg-gray-50 p-4">
			<View className="w-full">
				<View className="items-center mb-6">
					<View className="flex-row items-center justify-center">
						<TextInput
							className="w-rounded-xl px-2 py-2 text-base"
							value={data?.title}
							placeholderTextColor="black"
						/>
						<LuPenLine size={17} color="gray"></LuPenLine>
					</View>
					<Text className="text-lg text-gray-500 text-center">
						ROM Assessment - {data?.title}
					</Text>
				</View>

				{/* ROM Card */}
				<View className="flex flex-col bg-white rounded-xl px-6 [&:last-child]:pb-6 mb-6">
					<View className="flex-row items-center py-4">
						{/* Icon circle */}
						<View className="items-center justify-center mr-2">
							{/* small rotation icon */}
							<LuRotateCcw size={22} className="text-gray-400"></LuRotateCcw>
						</View>
						<Text className="text-xl">Range of Motion Summary</Text>
					</View>

					<View className="flex-row flex-wrap py-4">
						<View className="w-1/2">
							<Text className="text-xs text-muted-foreground mb-1 text-gray-400">Date & Time</Text>
							<Text className="font-medium text-sm">{data?.date}</Text>
						</View>

						<View className="w-1/2">
							<Text className="text-xs text-muted-foreground mb-1 text-gray-400">Duration</Text>
							<Text className="font-medium text-sm">~{data?.duration} min</Text>
						</View>
					</View>
				</View>

				{/* ROM Card */}
				<View className="flex flex-col bg-white rounded-xl px-6 [&:last-child]:pb-6 mb-6">
					<View className="flex-row items-center py-4">
						{/* Icon circle */}
						<View className="items-center justify-center mr-2">
							{/* small rotation icon */}
							<LuRotateCcw size={22} className="text-blue-500"></LuRotateCcw>
						</View>
						<Text className="text-xl">Range of Motion Visualisation</Text>
					</View>

					<View className="flex-row flex-wrap">
						<View className="w-1/3 p-2">
							<View className="text-center space-y-3">
								{/* Icon + description */}
								<View className="items-center bg-blue-50/80 border border-blue-200 rounded-xl p-4">
									<Image
										className="w-16 h-16"
										source={ExtensionSrcImage}
									/>
								</View>

								{/* Value + Max */}
								<View className="flex-column items-center justify-between mb-2">
									<Text className="font-semibold text-blue-700 text-sm">Extension</Text>
									<Text className="text-lg font-bold text-blue-600">{data ? data.extension : 0.0}°</Text>
								</View>
							</View>
						</View>

						<View className="w-1/3 p-2">
							<View className="text-center space-y-3">
								{/* Icon + description */}
								<View className="items-center bg-green-50/80 border border-green-200 rounded-xl p-4">
									<Image
										className="w-16 h-16"
										source={FlexionSrcImage}
									/>
								</View>

								{/* Value + Max */}
								<View className="flex-column items-center justify-between mb-2">
									<Text className="font-semibold text-green-700 text-sm">Flexion</Text>
									<Text className="text-lg font-bold text-green-600">{data ? data.flexion : 0.0}°</Text>
								</View>
							</View>
						</View>

						<View className="w-1/3 p-2">
							<View className="text-center space-y-3">
								{/* Icon + description */}
								<View className="items-center bg-purple-50/80 border border-purple-200 rounded-xl p-4">
									<Image
										className="w-16 h-16"
										source={LeftRotationSrcImage}
									/>
								</View>

								{/* Value + Max */}
								<View className="flex-column items-center justify-between mb-2">
									<Text className="font-semibold text-purple-700 text-sm">Right Rotation</Text>
									<Text className="text-lg font-bold text-purple-600">{data ? data.r_rotation : 0.0}°</Text>
								</View>
							</View>
						</View>

						<View className="w-1/3 p-2">
							<View className="text-center space-y-3">
								{/* Icon + description */}
								<View className="items-center bg-orange-50/80 border border-orange-200 rounded-xl p-4">
									<Image
										className="w-16 h-16"
										source={RightRotationSrcImage}
									/>
								</View>

								{/* Value + Max */}
								<View className="flex-column items-center justify-between mb-2">
									<Text className="font-semibold text-orange-700 text-sm">Left Rotation</Text>
									<Text className="text-lg font-bold text-orange-600">{data ? data.l_rotation : 0.0}°</Text>
								</View>
							</View>
						</View>

						<View className="w-1/3 p-2">
							<View className="text-center space-y-3">
								{/* Icon + description */}
								<View className="items-center bg-teal-50/80 border border-teal-200 rounded-xl p-4">
									<Image
										className="w-16 h-16"
										source={LeftLateralSrcImage}
									/>
								</View>

								{/* Value + Max */}
								<View className="flex-column items-center justify-between mb-2">
									<Text className="font-semibold text-teal-700 text-sm">Left Lateral</Text>
									<Text className="text-lg font-bold text-teal-600">{data ? data.l_lateral : 0.0}°</Text>
								</View>
							</View>
						</View>

						<View className="w-1/3 p-2">
							<View className="text-center space-y-3">
								{/* Icon + description */}
								<View className="items-center bg-pink-50/80 border border-pink-200 rounded-xl p-4">
									<Image
										className="w-16 h-16"
										source={RightLateralSrcImage}
									/>
								</View>

								{/* Value + Max */}
								<View className="flex-column items-center justify-between mb-2">
									<Text className="font-semibold text-pink-700 text-sm">Right Lateral</Text>
									<Text className="text-lg font-bold text-pink-600">{data ? data.r_lateral : 0.0}°</Text>
								</View>
							</View>
						</View>
					</View>

				</View>

				{/* Card */}
				<View className="bg-white rounded-xl p-4 shadow-md">
					<View className="flex-row items-center">
						<View className="w-8 h-8 rounded-full items-center justify-center mr-3">
							<LuCircleAlert size={20} color="gray"></LuCircleAlert>
						</View>
						<Text className="text-lg font-semibold text-gray-800">Clinical Considerations</Text>
					</View>

					{/* Inner blue note box */}
					<View className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
						<Text className="text-sm font-semibold text-blue-800 mb-2">Range of Motion Assessment Notes:</Text>

						<View className="pl-2">
							<View className="flex-row items-start mb-1">
								<Text className="text-sm text-blue-800 flex-1">• Values shown represent maximum achievable ranges in each direction</Text>
							</View>

							<View className="flex-row items-start mb-1">
								<Text className="text-sm text-blue-800 flex-1">• Symmetry index compares left/right movement patterns</Text>
							</View>

							<View className="flex-row items-start mb-1">
								<Text className="text-sm text-blue-800 flex-1">• Consider pain levels and patient comfort during interpretation</Text>
							</View>

							<View className="flex-row items-start">
								<Text className="text-sm text-blue-800 flex-1">• Compare with age-matched normative data and previous assessments</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Buttons area */}
				<View className="mt-6">
					<TouchableOpacity
						onPress={onPressGotoMain}
						activeOpacity={0.8}
						className="bg-green-600 rounded-xl py-4 items-center justify-center shadow-lg">
						<View className="flex-row items-center">
							<Text className="text-white text-base font-semibold mr-3">✓</Text>
							<Text className="text-white text-base font-semibold">Finish & Return Home</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity activeOpacity={0.8} className="mt-3 bg-white border border-gray-300 rounded-xl py-4 items-center justify-center">
						<View className="flex-row items-center">
							<LuChartColumn size={20} color="gray" className="mr-2"></LuChartColumn>
							<Text className="text-gray-700 text-base">View History</Text>
						</View>
					</TouchableOpacity>
				</View>

				<View className="h-12"></View>
			</View>
		</ScrollView >
	);
}

export default RangeOfMotionSummary