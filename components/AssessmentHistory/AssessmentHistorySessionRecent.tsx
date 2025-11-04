import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo } from 'react'
import { RootStackParamList } from '../../model/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styled } from 'nativewind';
import { RotateCcw } from 'lucide-react-native';
import type { DataROMProp } from "../../model/AssessmentHistory";

type NavigationProp = StackNavigationProp<RootStackParamList>;
const LuRotateCcw = styled(RotateCcw);


const AssessmentHistorySessionItems = memo(({ item, gotoHistory }: { item: DataROMProp, gotoHistory: any }) => {
	return (
		<View className="bg-blue-50/40 rounded-2xl border border-gray-200 p-4 mb-3 w-full">
			{/* Header */}
			<View className="flex-row justify-between items-center mb-2">
				<View className="flex-row items-center space-x-2">
					<LuRotateCcw size={15} className="text-purple-500"></LuRotateCcw>
					<View className="bg-purple-100 px-2 py-1 rounded-full">
						<Text className="text-purple-700 font-semibold text-xs">ROM</Text>
					</View>
				</View>
				<Text className="text-gray-400 text-xs">{6} pts</Text>
			</View>

			{/* Title */}
			<Text className="text-gray-800 font-semibold text-base mb-1">
				Progress Review
			</Text>
			<Text className="text-gray-500 text-sm mb-3">
				{item.date_str} at {item.time_str}
			</Text>

			{/* Stats */}
			<View className="space-y-2 mb-4">
				<View className="flex-row justify-between">
					<Text className="text-gray-500">Flexion:</Text>
					<Text className="text-gray-700 font-semibold">{item.flexion}°</Text>
					<Text className="text-gray-500">Extension:</Text>
					<Text className="text-gray-700 font-semibold">{item.extension}°</Text>
				</View>
				<View className="flex-row justify-between">
					<Text className="text-gray-500">Left Rot:</Text>
					<Text className="text-gray-700 font-semibold">{item.l_rotation}°</Text>
					<Text className="text-gray-500">Right Rot:</Text>
					<Text className="text-gray-700 font-semibold">{item.r_rotation}°</Text>
				</View>
				<View className="flex-row justify-between">
					<Text className="text-gray-500">Left Side:</Text>
					<Text className="text-gray-700 font-semibold">{item.l_lateral}°</Text>
					<Text className="text-gray-500">Right Side:</Text>
					<Text className="text-gray-700 font-semibold">{item.r_lateral}°</Text>
				</View>
			</View>

			{/* Button */}
			<TouchableOpacity className="border border-blue-100 bg-blue-50 py-2 rounded-xl"
				onPress={(key) => gotoHistory(key)}
			>
				<Text className="text-blue-600 text-center font-semibold">
					View Full Report
				</Text>
			</TouchableOpacity>
		</View>
	);
});

const AssessmentHistorySessionRecent = ({ dataRecent }: { dataRecent: DataROMProp[] }) => {
	const navigation = useNavigation<NavigationProp>();

	const gotoHistory = (key: string) => {
		navigation.replace("RangeOfMotionSummary", { key: key });
	};

	return (
		<View className="flex-1 bg-white rounded-2xl p-2">
			{/* Header */}
			<View className="flex-row justify-between items-center mb-4">
				<View className="flex-row items-center space-x-2">
					<Ionicons name="time-outline" size={20} color="#4B5563" />
					<Text className="text-lg font-semibold text-gray-900">
						Recent Sessions
					</Text>
				</View>
			</View>

			{/* Session list  */}
			<FlatList
				data={dataRecent}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <AssessmentHistorySessionItems item={item} gotoHistory={() => { gotoHistory(item.key) }} />}
				showsVerticalScrollIndicator={false}
				removeClippedSubviews={true}
				scrollEnabled={false}
			/>
		</View>
	)
}

export default AssessmentHistorySessionRecent

const styles = StyleSheet.create({})