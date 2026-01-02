import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, Animated, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';
import { LucidePlay, LucideSquare, RotateCcw, LucideTarget, LucideTimer } from 'lucide-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { RootStackParamList } from '../model/RootStackParamList';
import LiveHeadPosition from '../components/JointPositionSense/LiveHeadPosition';
import AssessmentDuration from '../components/RangeOfMotion/AssessmentDuration';
import { ChildROMRef } from '../model/ChildRefGetValue';
import { type JPSCommonInfo } from '../model/JointPosition';
import { getCurrentDateTime } from '../utils/getDateTime';

const LuTarget = styled(LucideTarget);
const LuPlay = styled(LucidePlay);
const LuSquare = styled(LucideSquare);
const LuRotateCcw = styled(RotateCcw);
const LuTimer = styled(LucideTimer);

type NavigationProp = StackNavigationProp<RootStackParamList>;

const INSTRUCTIONS = [
	'Patient keeps eyes closed between each movement',
	'Press "Record Position" to capture head positions',
	'Press "Finish" when assessment is complete'
];

const StatusCard = ({
	isRecording,
	onReset,
	refDuration
}: {
	isRecording: boolean;
	onReset: () => void;
	refDuration: React.RefObject<ChildROMRef | null>;
}) => {
	if (isRecording) {
		return (
			<View className="bg-green-50 rounded-xl px-4 py-4 shadow-sm">
				<View className="flex-row items-center">
					<View className="w-2/3">
						<View className="flex-row items-center">
							<View className="w-3 h-3 rounded-full bg-green-400 mr-4" />
							<View className="flex-column">
								<Text className="text-base text-green-800">Assessment Active</Text>
								<Text className="text-xs text-green-700">Live head position tracking</Text>
							</View>
						</View>
					</View>
					<View className="w-1/3">
						<View className="flex-row items-center justify-center">
							<LuTimer size={18} className="text-green-700 mr-2" />
							<AssessmentDuration record={isRecording} ref={refDuration} mode="JPS" />
						</View>
					</View>
				</View>
			</View>
		);
	}

	return (
		<View className="bg-blue-50 rounded-xl px-4 py-3 shadow-sm border border-blue-200">
			<View className="flex-row space-x-2 py-4 items-center">
				<View className="w-1/2">
					<View className="flex-row items-center">
						<View className="w-4 h-4 rounded-full bg-blue-400 mr-2" />
						<Text className="text-base text-blue-700">Device Ready</Text>
					</View>
				</View>
				<View className="w-1/2 px-2">
					<TouchableOpacity
						onPress={onReset}
						className="border border-blue-200 rounded-lg py-1 px-1"
					>
						<View className="flex-row items-center justify-between px-1">
							<LuRotateCcw className="text-blue-700" size={16} />
							<Text className="text-sm text-blue-700">Reset to Centre</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const InstructionsCard = () => (
	<View className="bg-blue-50 rounded-2xl px-4 py-3 shadow-sm items-center border border-blue-200">
		<View className="flex-row items-center mb-2">
			<LuTarget size={16} className='text-blue-600'/>
			<Text className="ml-2 font-regular text-black-700 text-sm">
				Instructions
			</Text>
		</View>
		<View className="space-y-1.5 w-full">
			{INSTRUCTIONS.map((instruction, index) => (
				<View key={index} className="flex-row items-start">
					<Text className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-xs font-bold text-center mr-2 flex-shrink-0">
						{index + 1}
					</Text>
					<Text className="flex-1 text-xs text-blue-700">{instruction}</Text>
				</View>
			))}
		</View>
	</View>
);

const JointPositionSense = () => {
	const navigation = useNavigation<NavigationProp>();
	const [isRecording, setIsRecording] = useState(false);
	const [jpsInfo, setJpsInfo] = useState<JPSCommonInfo | null>(null);

	const resetRef = useRef(false);
	const refDuration = useRef<ChildROMRef>(null);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: '',
			headerTitleAlign: 'left',
			headerStyle: {
				elevation: 0,
				shadowOpacity: 0,
				borderBottomWidth: 0,
			},
			headerLeft: () => (
				<Pressable
					onPress={() => navigation.replace('AssessmentSelection')}
					className="flex-row items-center bg-gray-100 px-3 py-1 rounded-lg"
				>
					<Ionicons name="arrow-back" size={18} color="black" />
					<Text className="ml-1 text-sm font-medium">Back</Text>
				</Pressable>
			),
			headerRight: () => isRecording ? (
				<View className="flex-row items-center px-3 py-1 rounded-full bg-green-100 border border-green-300 mr-2">
					<View className="w-2.5 h-2.5 rounded-full bg-green-600 mr-2" />
					<Text className="text-green-600 font-medium">Live Assessment</Text>
				</View>
			) : null,
		});
	}, [navigation, isRecording]);

	const handleReset = () => {
		resetRef.current = true;
	};

	const handleStartRecording = () => {
		const timestamp = Date.now().toString();
		const { strNowISO, localShortDateTime } = getCurrentDateTime();

		setJpsInfo({
			key: timestamp,
			idSession: timestamp,
			nowObj: {
				localShortDateTime,
				strNow: strNowISO
			}
		});
		setIsRecording(true);
	};

	return (
		<ScrollView className="flex-1 p-4 space-y-6">
			<View className="items-center">
				<Text className="text-base font-regular mb-1">
					Joint Position Sense Assessment
				</Text>
				<Text className="text-sm text-gray-500 text-center">
					{isRecording
						? 'Live head tracking with manual recording'
						: 'Fast clinical proprioceptive testing'
					}
				</Text>
			</View>

			{!isRecording && (
				<View className="flex-1 space-y-6">
					<InstructionsCard />
				</View>
			)}

			<View className="flex-1 space-y-6">
				<StatusCard
					isRecording={isRecording}
					onReset={handleReset}
					refDuration={refDuration}
				/>
			</View>

			{!isRecording && (
				<TouchableOpacity
					onPress={handleStartRecording}
					activeOpacity={0.9}
					className="rounded-xl overflow-hidden shadow"
				>
					<LinearGradient
						colors={['#00a63e', '#009966']}
						start={[0, 0]}
						end={[1, 0]}
						className="flex-row items-center justify-center w-full py-5"
					>
						<LuTarget size={16} color="white" />
						<Text className="text-white font-semibold ml-2">
							Start Live Assessment
						</Text>
					</LinearGradient>
				</TouchableOpacity>
			)}

			<LiveHeadPosition
				isReset={resetRef}
				refDuration={refDuration}
				record={isRecording}
				baseInfo={jpsInfo}
			/>

			<View className="h-12" />
		</ScrollView>
	);
};

export default JointPositionSense;