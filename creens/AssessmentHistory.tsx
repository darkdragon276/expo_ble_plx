import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../model/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LucideDownload } from 'lucide-react-native';
import { styled } from 'nativewind';
import AssessmentHistoryFilter from "../components/AssessmentHistory/AssessmentHistoryFilter";
import AssessmentHistorySessionRecent from "../components/AssessmentHistory/AssessmentHistorySessionRecent";
import AssessmentHistoryTags from "../components/AssessmentHistory/AssessmentHistoryTags";
import AssessmentHistorROMChart from "../components/AssessmentHistory/AssessmentHistorROMChart";
import { useDatabase } from '../db/useDatabase';
import { DB_SELECT_ALL_ROM } from '../db/dbQuery';
import type { DataROMProp } from "../model/AssessmentHistory";

type NavigationProp = StackNavigationProp<RootStackParamList>;
const LuDownload = styled(LucideDownload);

const AssessmentHistory = () => {
	const navigation = useNavigation<NavigationProp>();
	const [data, setData] = useState<DataROMProp[]>([])
	const db = useDatabase("headx.db");

	const [formData, setFormData] = useState({
		metric: "",
		time: "",
	});

	const handleSelect = (key: keyof typeof formData, value: string) => {
		setFormData({ ...formData, [key]: value });
	};

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
						onPress={() => navigation.goBack()}
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
						<LuDownload size={18} color="black" />
						<Text className="ml-1 text-sm font-medium">Export</Text>
					</Pressable >
				</View>
			)
		});
	}, [navigation]);

	useEffect(() => {
		const selectData = async () => {
			try {
				if (!db) {
					return;
				}

				let result = await db.getAllAsync<DataROMProp>(DB_SELECT_ALL_ROM);
				if (!result) {
					return;
				}
				result = result.map((item, index) => {
					const dt = new Date(item.date);

					const pad = (n: number) => n.toString().padStart(2, "0");
					const formatted =
						pad(dt.getMonth() + 1) +
						pad(dt.getDate()) +
						dt.getFullYear() +
						pad(dt.getHours()) +
						pad(dt.getMinutes()) +
						pad(dt.getSeconds());

					const asNumber = Number(formatted);
					const asString = `${pad(dt.getMonth() + 1)}/${pad(dt.getDate())}/${dt.getFullYear()}`;
					const timeStr = `${pad(dt.getHours())}:${pad(dt.getMinutes())}`;

					return {
						...item
						, xIndex: index
						, date_str: asString
						, time_str: timeStr
						, date_n: asNumber
					};
				});

				setData(result);

			} catch (error) {
				console.log(error);
			}
		};

		if (db) {
			selectData();
		}

	}, [db, formData])

	return (
		<ScrollView className="flex-1 bg-gray-50 p-4">
			<View className="w-full">
				<View className="items-center mb-6">
					<Text className="text-lg font-semibold mb-1">
						Assessment History
					</Text>
					<Text className="text-sm text-gray-500 text-center">
						Session tracking and progress analysis
					</Text>
				</View>
			</View>

			{/* Filter Section */}
			<AssessmentHistoryFilter
			//onSelect={(value: any) => handleSelect("metric", value)}
			>
			</AssessmentHistoryFilter>

			{/* Stats Section */}
			<AssessmentHistoryTags></AssessmentHistoryTags>

			{/* Chart Section */}
			<AssessmentHistorROMChart dataChart={data}></AssessmentHistorROMChart>

			{/* Session Recent Section */}
			<AssessmentHistorySessionRecent dataRecent={data}></AssessmentHistorySessionRecent>
		</ScrollView>
	)
}

export default AssessmentHistory

const styles = StyleSheet.create({})

function setData(result: DataROMProp[]) {
	throw new Error('Function not implemented.');
}
