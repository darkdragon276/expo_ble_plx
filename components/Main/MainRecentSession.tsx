import React, { memo, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDatabase } from "../../db/useDatabase";
import { DB_SELECT_RECENT_ROM } from "../../db/dbQuery";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../model/RootStackParamList";

type NavigationProp = StackNavigationProp<RootStackParamList>;

// 🟢 Kiểu dữ liệu cho session
type Session = {
	id: string;
	key: string;
	title: string;
	date: string;
	time: string;
	type: "JPS" | "ROM";
};

let sessions: Session[] = [
	// {
	// 	id: "1",
	// 	title: "JPS Session - Oct 2, 2:36 PM",
	// 	date: "10/2/2025, 2:36:57 PM",
	// 	time: "2:36 PM",
	// 	type: "JPS",
	// },
];

// 🟢 Component render từng item
const SessionItem = memo(({ item, gotoHistory }: { item: Session, gotoHistory: any }) => {
	//console.log(`SessionItem ---- ${item.key}`)
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

// 🟢 Màn hình chính
export default function MainRecentSession() {
	let db = useDatabase("headx.db");
	const [init, setInit] = useState(false);
	const navigation = useNavigation<NavigationProp>();

	useEffect(() => {
		const selectAllSession = async () => {
			if (!db) {
				//console.log(`MainRecentSession db is null`)
				return;
			}
			//console.log(`MainRecentSession render`)
			const rs = await db.getAllAsync<Session>(DB_SELECT_RECENT_ROM);
			//console.log(rs.length);
			if (rs) {
				sessions = rs
				setInit(true);
			}
		};

		if (db) selectAllSession();

		return () => {
			//console.log(`MainRecentSession unmount`)
			db = null;
			sessions = [];
			setInit(false)
		}

	}, [db])

	const gotoHistory = (key: string) => {
		console.log(`MainRecentSession: ${key}`)
		navigation.navigate("RangeOfMotionSummary", { key: key });
	};

	return (
		<View className="flex-1 bg-white rounded-2xl m-4 p-2">
			{/* Header */}
			<View className="flex-row justify-between items-center mb-4">
				<View className="flex-row items-center space-x-2">
					<Ionicons name="time-outline" size={20} color="#4B5563" />
					<Text className="text-lg font-semibold text-gray-900">
						Recent Sessions
					</Text>
				</View>
				<TouchableOpacity className="flex-row items-center space-x-1">
					<Ionicons name="arrow-forward-outline" size={18} color="#16A34A" />
					<Text className="text-green-600 font-medium">View All</Text>
				</TouchableOpacity>
			</View>

			{/* Session list  */}
			<FlatList
				data={sessions}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <SessionItem item={item} gotoHistory={() => { gotoHistory(item.key) }} />}
				showsVerticalScrollIndicator={false}
				removeClippedSubviews={true}
			/>
		</View>
	);
}
