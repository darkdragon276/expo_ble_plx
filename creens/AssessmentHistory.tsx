import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
import { DB_SELECT_ALL_ASM_CSV, DB_SELECT_ALL_ROM } from '../db/dbQuery';
import type { DataHistory, ComboboxFilter, DataAssessmentCSV } from "../model/AssessmentHistory";
import { TimeOptions as timeOptions, MetricOptions as metricOptions } from '../dummy/masterData'
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import * as SQLite from 'expo-sqlite';
import { CSV_HEADER } from '../dummy/Constants';

type NavigationProp = StackNavigationProp<RootStackParamList>;
const LuDownload = styled(LucideDownload);

const AssessmentHistory = () => {
	const navigation = useNavigation<NavigationProp>();
	const [data, setData] = useState<DataHistory[]>([])
	const db = useDatabase("headx.db");

	const [formData, setFormData] = useState<ComboboxFilter>({
		metric: metricOptions[0],
		time: timeOptions[0],
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
					<TouchableOpacity
						activeOpacity={0.1}
						onPress={exportCSV}
						className="flex-row items-center bg-gray-100 px-3 py-1 rounded-lg"
					>
						<LuDownload size={18} color="black" />
						<Text className="ml-1 text-sm font-medium">Export</Text>
					</TouchableOpacity >
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

	const exportCSV = async () => {
		const convertData = (result: DataAssessmentCSV[]) => {
			result = result.map((item) => {
				const dt = new Date(item.date);
				const pad = (n: number) => n.toString().padStart(2, "0");
				const asString = `${pad(dt.getMonth() + 1)}/${pad(dt.getDate())}/${dt.getFullYear()}`;

				return {
					date: asString
					, title: item.title.replace(",", "")
					, type: item.type
					, flexion: item.flexion
					, extension: item.extension
					, l_rotation: item.l_rotation
					, r_rotation: item.r_rotation
					, l_lateral: item.l_lateral
					, r_lateral: item.r_lateral
					, horizontal: item.horizontal
					, vertical: item.vertical
					, rotate: item.rotate
					, angular: item.angular
				};
			});

			return result;
		}

		try {
			const db = await SQLite.openDatabaseAsync('headx.db');
			if (!db) {
				return;
			}

			let result = await db.getAllAsync<DataAssessmentCSV>(DB_SELECT_ALL_ASM_CSV);
			if (!result || (result && result.length == 0)) {
				return;
			}

			result = convertData(result)

			let csv: any[] = [CSV_HEADER.join(",")];

			result.forEach(item => {
				const values = [item].map((value: any) => {
					return Object.values(value)
				});
				csv.push(values.join(","));
			});

			let csvRow = csv.join("\n");

			const today = new Date().toISOString().split("T")[0];
			const nameCsv = `assessment_history_${today}.csv`
			const fileUri = FileSystem.documentDirectory + nameCsv;

			if (Platform.OS === 'ios') {
				await FileSystem.writeAsStringAsync(fileUri, csvRow, {
					encoding: FileSystem.EncodingType.UTF8,
				});

				await Sharing.shareAsync(fileUri);

			} else if (Platform.OS === 'android') {

				const perm = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
				if (!perm.granted) {
					Alert.alert("Permission Denied", "You need to grant permission to access files.");
					return;
				}

				const dirUri = perm.directoryUri;
				const fileUriAndroid = await FileSystem.StorageAccessFramework.createFileAsync(
					dirUri,
					nameCsv,
					"text/csv"
				);

				await FileSystem.writeAsStringAsync(fileUriAndroid, csvRow, {
					encoding: FileSystem.EncodingType.UTF8,
				});
			}

		} catch (error) {
			//console.log(error);
		}
	}

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
					<AssessmentHistoryJPSChart timeFilter={formData.time.prop} ></AssessmentHistoryJPSChart>
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