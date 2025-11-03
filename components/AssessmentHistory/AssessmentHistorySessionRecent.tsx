import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo } from 'react'
import { RootStackParamList } from '../../model/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type Session = {
	id: string;
	key: string;
	title: string;
	date: string;
	time: string;
	type: "JPS" | "ROM";
};

let sessions: Session[] = [
	{
		id: "1",
		key: "ASA51251",
		title: "JPS Session - Oct 2, 2:36 PM",
		date: "10/2/2025, 2:36:57 PM",
		time: "2:36 PM",
		type: "JPS",
	},
	{
		id: "2",
		key: "AGEW251",
		title: "JPS Session - Oct 2, 2:36 PM",
		date: "10/2/2025, 2:36:57 PM",
		time: "2:36 PM",
		type: "JPS",
	},
	{
		id: "3",
		key: "ASA55231",
		title: "JPS Session - Oct 2, 2:36 PM",
		date: "10/2/2025, 2:36:57 PM",
		time: "2:36 PM",
		type: "JPS",
	},
];

const AssessmentHistorySessionItems = memo(({ item, gotoHistory }: { item: Session, gotoHistory: any }) => {
	return (
		<View className="bg-blue-50/40 rounded-2xl border border-gray-200 p-4 mb-3 shadow-sm">
			<View className="flex-row justify-between items-center">
				<Text className="text-gray-900 font-semibold">{item.title}</Text>
				<View
					className={`px-3 py-1 rounded-full ${item.type === "JPS" ? "bg-teal-100" : "bg-indigo-100"}`}>
					<Text
						className={`text-xs font-semibold ${item.type === "JPS" ? "text-teal-600" : "text-indigo-600"}`}>
						{item.type}
					</Text>
				</View>
			</View>
			<Text className="text-gray-500 text-sm mt-1">{item.date}</Text>
			<TouchableOpacity
				onPress={(key) => gotoHistory(key)}
			>
				<Text className="text-blue-500 text-sm mt-2">
					Tap to view full report
				</Text>
			</TouchableOpacity>
		</View>
	);
});

const AssessmentHistorySessionRecent = () => {
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
				data={sessions}
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