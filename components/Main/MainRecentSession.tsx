import React, { memo, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { LucideHistory, LucideTrendingUp, LucideTrash2 } from "lucide-react-native";
import { useDatabase } from "../../db/useDatabase";
import { DB_SELECT_RECENT, DB_DELETE_BY_KEY_ROM, DB_DELETE_BY_KEY_JPS, DB_DELETE_BY_KEY_JPS_RECORD } from "../../db/dbQuery";
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

const SessionItem = memo(({ item, gotoSummary, delAsm }: { item: Session, gotoSummary: any, delAsm: any }) => {
	const { date_MM_dd_yyyy_hh_mm_ss_ampm } = useConvertDateTime(new Date(item.date));

	return (
		<TouchableOpacity
			onPress={(item) => gotoSummary(item)}
		>
			<View className="bg-white rounded-2xl border border-gray-200 p-3 mb-3 shadow-sm">
				<View className="flex-row justify-between items-center">
					<Text className="text-md font-bold">{item.title}</Text>
					<View className="flex-column items-center">
						<View
							className={`px-3 py-1 rounded-full ${item.type === "JPS" ? "bg-teal-100" : "bg-indigo-100"}`}>
							<Text
								className={`text-xs font-semibold ${item.type === "JPS" ? "text-teal-600" : "text-indigo-600"}`}>
								{item.type}
							</Text>
						</View>
					</View>
				</View>
				<Text className="text-xs text-muted-foreground">{date_MM_dd_yyyy_hh_mm_ss_ampm}</Text>
				<View className="flex-row space-between">
					<Text className="flex-1 text-xs text-blue-600 mt-1">
						Tap to view full report
					</Text>
					<TouchableOpacity
						className="px-3"
						onPress={(key) => delAsm(key)}
					>
						<LucTrash size={20} color={"gray"} />
					</TouchableOpacity>
				</View>
			</View>
		</TouchableOpacity>
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

			const rs = await db.getAllAsync<Session>(DB_SELECT_RECENT);
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

	const gotoSummary = (item: Session) => {
		if (item.type == "JPS") {
			navigation.replace("JointPositionSenseSummary", { key: item.key });
		} else if (item.type === "ROM") {
			navigation.replace("RangeOfMotionSummary", { key: item.key });
		}
	};

	const delAsm = async (item: Session) => {
		if (item.type == "JPS") {
			delJPS(item);
		} else if (item.type === "ROM") {
			delROM(item);
		}
	}

	const delROM = async (item: Session) => {
		if (!db) {
			return;
		}

		const del = async (db: SQLiteDatabase) => {
			await db.runAsync(DB_DELETE_BY_KEY_ROM, [item.key])
			setData(prev => prev.filter(items => items.key !== item.key));
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

	const delJPS = async (item: Session) => {
		if (!db) {
			return;
		}

		const del = async (db: SQLiteDatabase) => {
			await db.withTransactionAsync(async () => {
				await db.runAsync(DB_DELETE_BY_KEY_JPS, [item.key])
				await db.runAsync(DB_DELETE_BY_KEY_JPS_RECORD, [item.key])
			});

			setData(prev => prev.filter(items => items.key !== item.key));
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
	}

	const gotoAssessmentHistory = () => {
		navigation.replace("AssessmentHistory");
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
				<TouchableOpacity className="flex-row rounded-xl items-center border border-gray-200 p-2 space-x-1"
					onPress={gotoAssessmentHistory}
				>
					<LuTrendUp size={18} className="text-green-600 mr-2" />
					<Text className="font-medium">View All</Text>
				</TouchableOpacity>
			</View>

			{/* Session list */}
			<FlatList
				data={data}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <SessionItem item={item} delAsm={() => delAsm(item)} gotoSummary={() => { gotoSummary(item) }} />}
				showsVerticalScrollIndicator={false}
				removeClippedSubviews={true}
			/>
		</View>
	);
}
