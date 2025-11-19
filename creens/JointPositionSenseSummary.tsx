import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Pressable, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { RootStackParamList } from '../model/RootStackParamList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styled } from 'nativewind';
import { LucideTarget, FileText, LucideCircleAlert, ChartColumn } from 'lucide-react-native';
import { useDatabase } from '../db/useDatabase';
import PositionCoordinates from '../components/JointPositionSense/PositionCoordinates';
import MakerCursorList from '../components/JointPositionSense/MakerCursorList';
import { MakerCursorProps } from '../model/JointPosition';
import { DB_SELECT_BY_ID_JPS, DB_UPDATE_BY_KEY_JPS } from '../db/dbQuery';
import useConvertDateTime from '../utils/convertDateTime';
import TitleSummary from '../components/@ComponentCommon/TitleSummary';
import JPSRecordedList from '../components/@ComponentCommon/JPSRecordedList';
import { JPSRecordDataProp } from '../model/JointPosition';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Asset } from "expo-asset";
import * as FileSystem from 'expo-file-system/legacy';
import { coordinatesScaleConvert } from '../utils/helper';

const LuTarget = styled(LucideTarget);
const LuFileText = styled(FileText);
const LuChartColumn = styled(ChartColumn);
const LuCircleAlert = styled(LucideCircleAlert);

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RProp = RouteProp<RootStackParamList, "JointPositionSenseSummary">;

let cursorPDF: any = []
let recordPDF: any = []

const JointPositionSenseSummary = () => {
	const navigation = useNavigation<NavigationProp>();
	const db = useDatabase("headx.db");
	const route = useRoute<RProp>();
	const [data, setData] = useState<JPSRecordDataProp[] | null>(null)
	const [cursor, setCursor] = useState<MakerCursorProps[] | null>(null)
	const [dateConvert, setDateConvert] = useState<string | null>()

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
						onPress={printPDF}
						className="flex-row items-center bg-gray-100 px-3 py-1 rounded-lg"
					>
						<LuFileText size={18} color="black" />
						<Text className="ml-1 text-sm font-medium">Export PDF</Text>
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

				const { key } = route.params;
				const rs = await db.getAllAsync<JPSRecordDataProp>(DB_SELECT_BY_ID_JPS, key);

				if (rs && rs.length > 0) {

					const result = rs.map((item: JPSRecordDataProp, index: number) => {
						return {
							id: item.id_record.toString()
							, xRaw: coordinatesScaleConvert(item.horizontalScale)
							, yRaw: coordinatesScaleConvert(item.verticalScale, -1)
							, x: item.horizontalScale
							, y: item.verticalScale
							, z: item.angular.toString()
						};
					});

					cursorPDF = result;
					recordPDF = rs;
					//console.log(cursorPDF);
					const { date_MM_dd_yyyy_at_hh_mm_ampm } = useConvertDateTime(new Date(rs[0].date));
					setDateConvert(date_MM_dd_yyyy_at_hh_mm_ampm)
					setData(rs);
					setCursor(result);
				}
			} catch (error) {
				console.log(error);
			}
		};

		if (db) {
			selectData();
		}

	}, [db])

	const callbackSaveTitle = async (title: string): Promise<boolean> => {
		try {
			if (!db) {
				return Promise.resolve(true);
			}

			await db.runAsync(DB_UPDATE_BY_KEY_JPS, [title, data ? data[0]?.key : ""]);
			return Promise.resolve(true);
		} catch (error) {
			return Promise.resolve(false);
		}
	}

	const printPDF = async () => {

		// load ROM html template
		const template = Asset.fromModule(require('../assets/PDFTemplate/JPSTemplate.html'));
		await template.downloadAsync();

		const htmlTemplate = await FileSystem.readAsStringAsync(template.localUri || "");

		let cursors: any[] = [];
		let _cursor =
			`	
				<div class="absolute" style="transform: translate({{x}}px, {{y}}px);">
					<div class="absolute w-5 h-0.5 bg-purple-600 opacity-75 -translate-x-1/2 -translate-y-1/2">
					</div>
					<div class="absolute h-5 w-0.5 bg-purple-600 opacity-75 -translate-x-1/2 -translate-y-1/2">
					</div>
					<div class="absolute -top-6 left-1/2 -translate-x-1/2">
						<div class="bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full font-medium shadow-sm">{{id_record}}
						</div>
					</div>
				</div>
		`;

		cursorPDF?.forEach((cur: any) => {
			let temp = _cursor;
			temp = temp.replace("{{x}}", (cur.xRaw).toString())
				.replace("{{y}}", (cur.yRaw).toString())
				.replace("{{id_record}}", cur.id.toString())

			cursors.push(temp);
		})

		//console.log(cursors.join(""))
		//return;
		let records: any[] = [];
		let _record =
			`	
				<div class="flex items-center justify-between bg-white shadow p-1 rounded-xl">
					<div class="flex items-center space-x-3">
						<div class="bg-purple-600 text-white px-3 py-1 rounded-md font-semibold">#{{id}}</div>
						<div class="text-gray-700 font-medium">{{current}}</div>
					</div>
					<div class="text-right text-sm">
						<div class="text-gray-800 font-semibold">Horizontal: {{horizontal}}°</div>
						<div class="text-gray-800 font-semibold">Vertical: {{vertical}}°</div>
						<div class="text-gray-800 font-semibold">Angular: {{angular}}°</div>
					</div>
				</div>
		`;

		recordPDF?.forEach((record: any) => {
			let temp = _record;
			temp = temp.replace("{{id}}", record.id_record.toString())
				.replace("{{current}}", record.current)
				.replace("{{angular}}", record.angular.toString())
				.replace("{{horizontal}}", record.horizontal.toString())
				.replace("{{vertical}}", record.vertical.toString())

			records.push(temp);
		})

		//console.log(`-------------------------------------------------`)
		//console.log(cursors.join(''))
		//console.log(recordPDF[0].title)
		//return;

		const { date_MM_dd_yyyy_at_hh_mm_ampm } = useConvertDateTime(new Date(recordPDF[0].date));

		// loaded data to html template
		const html = htmlTemplate
			.replace('{{title}}', recordPDF[0].title)
			.replace('{{datetime}}', `JPS Assessment - ${date_MM_dd_yyyy_at_hh_mm_ampm}`)
			.replace("{{maker-cuscor}}", cursors.join(''))
			.replace("{{records}}", records.join(''))
			.replace("{{total_record}}", records.length.toString())

		// create PDF from .html
		const { uri } = await Print.printToFileAsync({ html });

		// rename file
		const newPath = `${FileSystem.documentDirectory}${recordPDF[0].title}.pdf`;

		await FileSystem.moveAsync({
			from: uri,
			to: newPath,
		});

		// open or share file PDF
		if (await Sharing.isAvailableAsync()) {
			await Sharing.shareAsync(newPath);
		}
	};

	return (
		<ScrollView className="flex-1 p-4 space-y-4">
			<View className="items-center mb-6">
				<TitleSummary
					title={data ? data[0]?.title : ""}
					callback={async (text: string) => callbackSaveTitle(text)}
				>
				</TitleSummary>
				<Text className="text-sm text-gray-500 text-center">
					JPS Assessment - {dateConvert}
				</Text>
			</View>

			<View className="flex flex-col bg-white rounded-xl [&:last-child]:pb-6 mb-2">
				<View className="flex-row items-center p-4">
					<View className="items-center justify-center mr-2">
						<LuTarget size={22} className="text-orange-500"></LuTarget>
					</View>
					<Text className="text-xl">Target Analysis</Text>
				</View>


				{/* svg */}
				<View className="bg-gray-50 mx-3">
					<View className="relative w-48 h-48 mx-auto my-6 bg-gray-50 from-gray-50 to-gray-100 rounded-full border-2 border-gray-300 shadow-inner">
						<PositionCoordinates>
							<MakerCursorList mode={"SUMMARY"} getData={() => undefined} subscribe={() => { }} data={cursor}></MakerCursorList>
						</PositionCoordinates>
					</View>
				</View>

				<View className="flex-1 items-center p-2">
					<Text className="mt-4 text-xs text-muted-foreground text-center opacity-75">
						<Text className="text-sm font-semibold">How to read this chart:</Text> Each numbered point represents a repositioning attempt. Centre indicates perfect accuracy. Closer points show better proprioceptive performance.
					</Text>
				</View>
			</View>

			{/* jps record list */}
			<View className="flex-1 bg-white rounded-2xl px-6 py-2">
				<View>
					<Text className="text-muted-foreground text-md font-bold mb-3">
						Recorded Positions ({cursor ? cursor.length : 0})
					</Text>
				</View>

				<FlatList
					data={data}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => <JPSRecordedList item={item} />}
					scrollEnabled={false}
				/>
			</View>

			{/* Buttons area */}
			<View className="mt-1">
				<TouchableOpacity
					onPress={() => navigation.replace("Main")}
					activeOpacity={0.8}
					className="bg-green-600 rounded-xl py-4 items-center justify-center shadow-lg">
					<View className="flex-row items-center">
						<Text className="text-white text-base font-semibold mr-3">✓</Text>
						<Text className="text-white text-base font-semibold">Finish & Return Home</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => navigation.replace("AssessmentHistory")}
					className="mt-3 bg-white border border-gray-300 rounded-xl py-4 items-center justify-center">
					<View className="flex-row items-center">
						<LuChartColumn size={20} color="gray" className="mr-2"></LuChartColumn>
						<Text className="text-gray-700 text-base">View History</Text>
					</View>
				</TouchableOpacity>
			</View>

			<View className="bg-white p-4 rounded-xl shadow">
				{/* Title */}
				<View className="flex-row items-center mb-3">
					<LuCircleAlert size={20} color="gray" className="mr-2"></LuCircleAlert>
					<Text className="text-xl font-semibold">Clinical Considerations</Text>
				</View>

				{/* Content Box */}
				<View className="bg-blue-50 p-4 rounded-xl border border-blue-200">
					<Text className="text-base text-blue-800 font-semibold mb-2">
						Joint Position Sense Assessment Notes:
					</Text>

					<View className="space-y-2">
						<Text className="text-sm text-blue-800">• Lower error values indicate better proprioceptive function</Text>
						<Text className="text-sm text-blue-800">• Lower variability suggests more consistent responses</Text>
						<Text className="text-sm text-blue-800">• Consider fatigue effects and learning curve in interpretation</Text>
						<Text className="text-sm text-blue-800">• Correlation with functional outcomes may vary by patient</Text>
					</View>
				</View>
			</View>

			<View className="h-12"></View>

		</ScrollView>
	);
}

export default JointPositionSenseSummary;
