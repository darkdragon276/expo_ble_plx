import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { RootStackParamList } from '../model/RootStackParamList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';
import { LucidePlay, LucideSquare, RotateCcw, LucideTarget } from 'lucide-react-native';
import LiveHeadPosition from '../components/JointPositionSense/LiveHeadPosition';

const CIRCLE_RADIUS = 150;
const CURSOR_RADIUS = 10;

const LuTarget = styled(LucideTarget);
const LuPlay = styled(LucidePlay);
const LuSquare = styled(LucideSquare);
const LuRotateCcw = styled(RotateCcw);

type NavigationProp = StackNavigationProp<RootStackParamList>;

const JointPositionSense = () => {
	const navigation = useNavigation<NavigationProp>();
	const [record, setRecord] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const animatedPos = useState(new Animated.ValueXY({ x: 0, y: 0 }))[0];

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
						onPress={() => navigation.replace("AssessmentSelection")}
						className="flex-row items-center bg-gray-100 px-3 py-1 rounded-lg"
					>
						<Ionicons name="arrow-back" size={18} color="black" />
						<Text className="ml-1 text-sm font-medium">Back</Text>
					</Pressable>
				</View>
			),
			headerRight: () => {
				return record
					?
					<View className="flex-row items-center px-3 py-1 rounded-full bg-green-100 border border-green-300 mr-2">
						<View className="w-2.5 h-2.5 rounded-full bg-green-600 mr-2" />
						<Text className="text-green-600 font-medium">Recording</Text>
					</View>
					:
					<></>;
			}
		});
	}, [navigation, record]);

	useEffect(() => {

	}, []);


	return (
		<ScrollView className="flex-1 p-4 space-y-6">
			<View className="items-center">
				<Text className="text-lg font-semibold mb-1">
					Joint Position Sense Assessment
				</Text>
				<Text className="text-sm text-gray-500 text-center">
					Fast clinical proprioceptive testing
				</Text>
			</View>

			<View className="flex-1 space-y-6">
				{/* Card Instructions */}
				<View className="bg-blue-50 rounded-xl px-4 py-3 shadow-sm">
					{/* Header */}
					{/* <View className="flex-row items-center justify-center">
                        <LuUsers size={20}></LuUsers>
                        <Text className="ml-2 font-semibold text-blue-700">Instructions</Text>
                    </View> */}

					{/* List Steps */}
					<View className="space-y-2">
						<View className="flex-row items-start">
							<Text className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold text-center mr-2">
								1
							</Text>
							<Text className="flex-1 text-sm text-blue-700">
								Patient keeps eyes closed between each movement
							</Text>
						</View>

						<View className="flex-row items-start">
							<Text className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold text-center mr-2">
								2
							</Text>
							<Text className="flex-1 text-sm text-blue-700">
								Press "Record Position" to capture head positions
							</Text>
						</View>

						<View className="flex-row items-start">
							<Text className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold text-center mr-2">
								3
							</Text>
							<Text className="flex-1 text-sm text-blue-700">
								Press "Finish" when assessment is complete
							</Text>
						</View>
					</View>
				</View>
			</View>

			<View className="flex-1 space-y-6">
				<View className="bg-blue-50 rounded-xl px-4 py-3 shadow-sm">
					<View className="flex-row space-x-2 py-4 items-center">
						<View className="w-1/2">
							<View className="flex-row items-center">
								<View className="w-4 h-4 rounded-full bg-blue-400 text-blue-600 text-xs font-bold text-center mr-2"></View>
								<Text className="text-xl text-blue-700">
									Device Ready
								</Text>
							</View>
						</View>
						<View className="w-1/2">
							<View className="w-full bg-blue-100 text-blue-600 rounded-xl py-3">
								<TouchableOpacity>
									<View className="flex-row items-center justify-center space-x-2 ">
										<LuRotateCcw size={20}></LuRotateCcw>
										<Text className="text-sm text-blue-700">
											Reset to Centre
										</Text>
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</View>

			{/* Start Assessment Button */}
			<View>
				{
					!record
						?
						<TouchableOpacity
							onPress={() => { }}
							activeOpacity={0.9} className="rounded-xl overflow-hidden shadow">
							<LinearGradient
								colors={["#00a63e", "#009966"]}
								start={[0, 0]}
								end={[1, 0]}
								className="flex-row items-center justify-center w-full py-4 px-8"
							>
								<LuTarget size={20} color="white"></LuTarget>
								<Text className="text-white font-semibold ml-2 p-3">Start Live Assessment</Text>
							</LinearGradient>
						</TouchableOpacity>
						:
						<TouchableOpacity
							onPress={() => { }}
							activeOpacity={0.9} className="rounded-xl overflow-hidden shadow w-2/3">
							<LinearGradient
								colors={["#B91C1C", "#B91C1C"]}
								start={[0, 0]}
								end={[1, 0]}
								className="flex-row bg-red-700 items-center justify-center w-full py-4 px-8"
							>
								<LuSquare size={20} color="white"></LuSquare>
								<Text className="text-white font-semibold ml-2 p-3">Stop Recording</Text>
							</LinearGradient>
						</TouchableOpacity>
				}
			</View>

			{/* Live Head Position */}
			<LiveHeadPosition></LiveHeadPosition>

			<View className="h-12"></View>

		</ScrollView>
	);
}

export default JointPositionSense;
