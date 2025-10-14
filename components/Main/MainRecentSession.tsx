import React, { memo, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { LucideHistory, LucideTrendingUp, LucideTrash2 } from "lucide-react-native";
import { useDatabase } from "../../db/useDatabase";
import { DB_SELECT_RECENT_ROM, DB_DELETE_BY_KEY_ROM } from "../../db/dbQuery";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../model/RootStackParamList";
import { styled } from 'nativewind';
import useConvertDateTime from "../../utils/convertDateTime";
import { SQLiteDatabase } from "expo-sqlite";

const LuTrendUp = styled(LucideTrendingUp);
const LucHistory = styled(LucideHistory);
const LucTrash = styled(LucideTrash2);

type NavigationProp = StackNavigationProp<RootStackParamList>;

type Session = {
	id: string;
	key: string;
	title: string;
	date: string;
	type: "JPS" | "ROM";
};

const SessionItem = memo(({ item, gotoHistory, delROM }: { item: Session, gotoHistory: any, delROM: any }) => {
	const { date_dd_MM_yyyy_hh_mm_ss_ampm } = useConvertDateTime(new Date(item.date));

	return (
		<View className="flex-row static bg-white rounded-2xl border border-gray-200 p-3 mb-3 shadow-sm">
			<TouchableOpacity
				onPress={(key) => gotoHistory(key)}
				className="mr-5"
			>
				<View className="flex-row justify-between items-center">
					<Text className="text-md font-bold">{item.title}</Text>
				</View>
				<Text className="text-xs text-muted-foreground">{date_dd_MM_yyyy_hh_mm_ss_ampm}</Text>
				<Text className="text-xs text-blue-600 mt-1">
					Tap to view full report
				</Text>
			</TouchableOpacity>
			<View className="flex-column absolute justify-between items-center right-1 top-3 bottom-3">
				<View
					className={`px-3 py-1 rounded-full ${item.type === "JPS" ? "bg-teal-100" : "bg-indigo-100"}`}>
					<Text
						className={`text-xs font-semibold ${item.type === "JPS" ? "text-teal-600" : "text-indigo-600"}`}>
						{item.type}
					</Text>
				</View>
				<TouchableOpacity
					onPress={(key) => delROM(key)}
				>
					<LucTrash size={20} color={"gray"} />
				</TouchableOpacity>
			</View>
		</View>
	);
});

export default function MainRecentSession() {
	let db = useDatabase("headx.db");
	const [init, setInit] = useState(false);
	const [data, setData] = useState<Session[]>([]);
	const navigation = useNavigation<NavigationProp>();

	useEffect(() => {
		const selectAllSession = async () => {
			if (!db) {
				return;
			}

			const rs = await db.getAllAsync<Session>(DB_SELECT_RECENT_ROM);
			if (rs) {
				setData(rs);
				setInit(true);
			}
		};

		if (db) selectAllSession();

		return () => {
			db = null;
			setInit(false)
		}

	}, [db])

	const gotoHistory = (key: string) => {
		navigation.replace("RangeOfMotionSummary", { key: key });
	};

	const delROM = async (key: string) => {
		if (!db) {
			return;
		}

		const del = async (db: SQLiteDatabase) => {
			await db.runAsync(DB_DELETE_BY_KEY_ROM, [key])
			setData(prev => prev.filter(item => item.key !== key));
		}

		Alert.alert("", "Are you sure?", [
			{
				text: "Yes",
				onPress: () => { del(db!) }
			},
			{
				text: "No",
			}
		]);
	};

	return (
		<View className="flex-1 bg-white rounded-2xl m-4 px-6 py-4">
			{/* Header */}
			<View className="flex-row justify-between items-center mb-4">
				<View className="flex-row items-center space-x-2">
					<LucHistory size={20} className="text-blue-500" />
					<Text className="text-lg font-semibold text-gray-900">
						Recent Sessions
					</Text>
				</View>
				<TouchableOpacity className="flex-row rounded-xl items-center border border-gray-200 p-2 space-x-1">
					<LuTrendUp size={18} className="text-green-600 mr-2" />
					<Text className="font-medium">View All</Text>
				</TouchableOpacity>
			</View>

			{/* Session list */}
			<FlatList
				data={data}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <SessionItem item={item} delROM={() => delROM(item.key)} gotoHistory={() => { gotoHistory(item.key) }} />}
				showsVerticalScrollIndicator={false}
				removeClippedSubviews={true}
			/>
		</View>
	);
}
