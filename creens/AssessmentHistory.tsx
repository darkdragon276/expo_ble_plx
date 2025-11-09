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
import AssessmentHistoryJPSChart from "../components/AssessmentHistory/AssessmentHistoryJPSChart";
import { useDatabase } from '../db/useDatabase';
import { DB_SELECT_ALL_ROM } from '../db/dbQuery';
import type { DataHistory } from "../model/AssessmentHistory";
import { type Combobox, TimeOptions as timeOptions, MetricOptions as metricOptions } from '../dummy/masterData'

type NavigationProp = StackNavigationProp<RootStackParamList>;
type ComboboxFilter = {
	metric: Combobox,
	time: Combobox,
}
const LuDownload = styled(LucideDownload);

const AssessmentHistory = () => {
	const navigation = useNavigation<NavigationProp>();
	const [data, setData] = useState<DataHistory[]>([])
	const db = useDatabase("headx.db");

	const [formData, setFormData] = useState<ComboboxFilter>({
		metric: timeOptions[0],
		time: metricOptions[0],
	});

	const handleSelect = (key: keyof typeof formData, value: string) => {
		setFormData({ ...formData, [key]: value });
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "Assessment History",
			headerTitleAlign: "center",
			headerStyle: {
				elevation: 0,
				shadowOpacity: 0,
				borderBottomWidth: 0,
			},
			headerLeft: () => (
				<View className="flex-row items-center">
					<Pressable
						onPress={() => navigation.replace("Main")}
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
				//console.log(`AssessmentHistory time: ${formData.time.prop} , metric: ${formData.metric.prop}`)
				let result = await db.getAllAsync<DataHistory>(DB_SELECT_ALL_ROM);
				if (!result) {
					return;
				}

				result = convertData(result);
				result = filerConditionSearch(result);
				setData(result);

			} catch (error) {
				console.log(error);
			}
		};

		if (db) {
			selectData();
		}

	}, [db, formData.metric, formData.time])

	const filerConditionSearch = (result: DataHistory[]) => {
		const time = formData.time.prop;
		const metric = formData.metric.prop;

		// filter date
		let date = new Date();
		let lastDay;
		switch (time) {
			case "last_week":
				date.setDate(date.getDate() - 7);
				break;
			case "last_month":
				date.setMonth(date.getMonth() - 1);
				lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
				date.setDate(lastDay);
				break;

			case "last_3_month":
				date.setMonth(date.getMonth() - 3);
				lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
				date.setDate(lastDay);
				break;

			default:
				break;
		}
		//console.log(`filerConditionSearch date: ${date}`)
		if (time !== "all") {
			result = result.filter(item => {
				return item.dt > date;
			})
		}

		//filter metric
		let type = ""
		switch (metric) {
			case "rom":
				type = "ROM"
				break;
			case "jps":
				type = "JPS"
				break;

			default:
				break;
		}

		if (metric !== "all") {
			result = result.filter(item => {
				return item.type == type
			})
		}

		return result;
	};

	const convertData = (result: DataHistory[]) => {
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
				, dt: dt
			};
		});

		return result;
	};

	return (
		<ScrollView className="flex-1 bg-gray-50 py-2 px-4">
			<View className="w-full">
				<View className="items-center mb-2">
					{/* <Text className="text-lg font-semibold mb-1">
						Assessment History
					</Text> */}
					<Text className="text-sm text-gray-500 text-center">
						Session tracking and progress analysis
					</Text>
				</View>
			</View>

			{/* Filter Section */}
			<AssessmentHistoryFilter
				onSelectTime={(value: any) => handleSelect("time", value)}
				onSelectMetric={(value: any) => handleSelect("metric", value)}
			>
			</AssessmentHistoryFilter>

			{/* Stats Section */}
			<AssessmentHistoryTags dataChart={data}></AssessmentHistoryTags>

			{/* ROM Chart Section */}
			{
				(formData.metric.prop == "rom" || formData.metric.prop == "all")
					?
					<AssessmentHistorROMChart dataChart={data}></AssessmentHistorROMChart>
					:
					<></>
			}

			{/* JPSChart Section */}
			{
				(formData.metric.prop == "jps" || formData.metric.prop == "all")
					?
					<AssessmentHistoryJPSChart></AssessmentHistoryJPSChart>
					:
					<></>
			}

			{/* Session Recent Section */}
			<AssessmentHistorySessionRecent dataRecent={data}></AssessmentHistorySessionRecent>
		</ScrollView>
	)
}

export default AssessmentHistory

const styles = StyleSheet.create({})