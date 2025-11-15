import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { RootStackParamList } from '../model/RootStackParamList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';
import { LucidePlay, LucideSquare, RotateCcw, LucideTarget, LucideTimer, FileText, X, PenLine, LucideCheck, LucideX, ChartColumn } from 'lucide-react-native';
import LiveHeadPosition from '../components/JointPositionSense/LiveHeadPosition';
import { ChildROMRef } from '../model/ChildRefGetValue';
import AssessmentDuration from '../components/RangeOfMotion/AssessmentDuration';
import { useDatabase } from '../db/useDatabase';
import PositionCoordinates from '../components/JointPositionSense/PositionCoordinates';
import MakerCursorList from '../components/JointPositionSense/MakerCursorList';
import HeadPositionRecorded from '../components/JointPositionSense/HeadPositionRecorded';
import { LiveRecorded, MakerCursorProps } from '../model/JointPosition';
import { DB_SELECT_BY_ID_JPS } from '../db/dbQuery';
import useConvertDateTime from '../utils/convertDateTime';

const LuTarget = styled(LucideTarget);
const LuFileText = styled(FileText);
const LuRotateCcw = styled(RotateCcw);
const LuTimer = styled(LucideTimer);
const LuChartColumn = styled(ChartColumn);

const LuPenLine = styled(PenLine);
const LuCheck = styled(LucideCheck);
const LuUnCheck = styled(LucideX);

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RProp = RouteProp<RootStackParamList, "JointPositionSenseSummary">;
type DataProp = {
	//id, key, id_session, title, date, horizontal, vertical, angular, current, duration
	id: number,
	key: string,
	id_session: string,
	id_record: number,
	date: string,
	title: string,
	horizontal: number,
	vertical: number,
	angular: number,
	current: string,
	duration: number,
}
type DtConvert = {
	date_MM_dd_yyyy_hh_mm_ss_ampm: string,
	date_MM_dd_yyyy_at_hh_mm_ampm: string,
	date_short: string,
}

const TitleSummary = ({ title, dataKey }: { title: string, dataKey: string }) => {
	const [text, setText] = useState(title)
	const [oldtext, setOldText] = useState(title)
	const [edit, setEditText] = useState(false)
	const db = useDatabase("headx.db");

	useEffect(() => {
		setText(title)
		setOldText(title);
	}, [title])

	const rollbackTitle = () => {
		setText(oldtext);
		setEditText(false);
	}

	const saveTitle = async () => {
		// try {
		// 	if (!db) {
		// 		return;
		// 	}

		// 	await db.runAsync(DB_UPDATE_BY_KEY_ROM, [text, dataKey]);
		// 	setText(text);
		// 	setOldText(text);
		// } catch (error) {
		// } finally {
		// 	setEditText(false)
		// }
	}

	return (
		<View className="flex-row items-center justify-center">
			{
				!edit
					?
					<>
						<Text className="w-rounded-xl font-bold px-2 py-2 text-lg">{text}</Text>
						<LuPenLine size={20} color="gray" onPress={() => setEditText(true)}></LuPenLine>
					</>
					:
					<>
						<TextInput
							className="w-rounded-xl font-bold px-2 py-2 text-lg"
							defaultValue={text}
							onChangeText={newText => setText(newText)}
							placeholderTextColor="black"
						/>
						<View className="flex-row items-space-between">
							<TouchableOpacity onPress={saveTitle}>
								<View className="border border-green-500 rounded-md py-1 mr-2 z-10">
									<LuCheck size={20} className="text-green-500 px-6"></LuCheck>
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPress={rollbackTitle}>
								<View className="border border-red-500 rounded-md py-1 mr-2 z-10">
									<LuUnCheck size={20} className="text-red-500 px-6"></LuUnCheck>
								</View>
							</TouchableOpacity>
						</View>
					</>
			}

		</View>
	)
};

const SessionItem = ({ item }: { item: DataProp }) => {
	return (
		<View className="flex-row justify-between items-center my-1">
			<View className="flex-row space-x-2 w-3/7">
				<View className="w-7 h-5 justify-between items-center rounded-xl bg-purple-50 border-purple-200">
					<Text className="text-md text-purple-700 font-semibold">#{item.id}</Text>
				</View>
				<Text className="text-md font-semibold">{item.current}</Text>
			</View>

			<View className="flex-column w-4/7">
				<View className="flex-row items-center justify-items-center">
					<View className="w-1/9 p-1">
						<Text className="text-md font-semibold">H:</Text>
					</View>
					<View className="w-3/9 p-1">
						<Text className="text-md font-semibold">{item.horizontal.toFixed(1)}°</Text>
					</View>
					<View className="w-1/9 p-1">
						<Text className="text-md font-semibold">|</Text>
					</View>
					<View className="w-1/9 p-1">
						<Text className="text-md font-semibold">V:</Text>
					</View>
					<View className="w-3/9 p-1">
						<Text className="text-md font-semibold">{item.vertical.toFixed(1)}°</Text>
					</View>
				</View>
				<View className="items-end">
					<Text className="text-md font-semibold">
						{item.angular}
					</Text>
				</View>
			</View>
		</View>
	);
};

const JointPositionSenseSummary = () => {
	const navigation = useNavigation<NavigationProp>();
	const db = useDatabase("headx.db");
	const route = useRoute<RProp>();
	const [data, setData] = useState<DataProp[] | null>(null)
	const [cursor, setCursor] = useState<MakerCursorProps[] | null>(null)
	const [dateConvert, setDateConvert] = useState<DtConvert | null>()

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
						onPress={() => { }}
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
				//console.log(key)
				const rs = await db.getAllAsync<DataProp>(DB_SELECT_BY_ID_JPS, key);
				//console.log(rs)
				if (rs) {
					// const { date_MM_dd_yyyy_hh_mm_ss_ampm, date_MM_dd_yyyy_at_hh_mm_ampm, date_short } = useConvertDateTime(new Date(rs.date));
					// resultROMSummary = rs;
					// resultROMSummary.date = date_MM_dd_yyyy_at_hh_mm_ampm

					const result = rs.map((item: DataProp, index: number) => {
						//const dt = new Date(item.date);

						return {
							id: item.id_record.toString()
							, x: item.horizontal
							, y: item.vertical
							, z: item.angular.toString()
							//, dt: dt
						};
					});

					const { date_MM_dd_yyyy_hh_mm_ss_ampm, date_MM_dd_yyyy_at_hh_mm_ampm, date_short } = useConvertDateTime(new Date(rs[0].date));
					setDateConvert({ date_MM_dd_yyyy_hh_mm_ss_ampm, date_MM_dd_yyyy_at_hh_mm_ampm, date_short })

					setData(rs);
					setCursor(result);
					// setDateConvert({ date_MM_dd_yyyy_hh_mm_ss_ampm, date_MM_dd_yyyy_at_hh_mm_ampm, date_short })
				}
			} catch (error) {
				console.log(error);
			}
		};

		if (db) {
			selectData();
		}

	}, [db])


	return (
		<ScrollView className="flex-1 p-4 space-y-4">
			<View className="items-center mb-6">
				<TitleSummary
					title={data ? data[0]?.title : ""}
					dataKey={data ? data[0]?.key : ""}>
				</TitleSummary>
				<Text className="text-sm text-gray-500 text-center">
					JPS Assessment - {dateConvert?.date_MM_dd_yyyy_at_hh_mm_ampm}
				</Text>
			</View>

			<View className="flex flex-col bg-white rounded-xl [&:last-child]:pb-6 mb-6">
				<View className="flex-row items-center p-4">
					<View className="items-center justify-center mr-2">
						<LuTarget size={22} className="text-orange-500"></LuTarget>
					</View>
					<Text className="text-xl">Target Analysis</Text>
				</View>


				{/* svg */}
				<View className="bg-gray-50 m-3">
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
			{/* <HeadPositionRecorded getData={() => { }} subscribe={() => {}}></HeadPositionRecorded> */}
			<View>
				<View className="items-center">
					<Text className="text-muted-foreground text-xs text-center mb-3">
						Record at least one position to finish assessment
					</Text>
				</View>
				<View className="flex-1 bg-white rounded-2xl px-6 py-2">
					{/* <View>
						<Text className="text-muted-foreground text-md font-bold mb-3">
							Recorded Positions ({cursor ? cursor.length : 0})
						</Text>
					</View> */}

					<FlatList
						data={data}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => <SessionItem item={item} />}
						scrollEnabled={false}
					/>
				</View>
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
					onPress={() => () => navigation.replace("AssessmentHistory")}
					className="mt-3 bg-white border border-gray-300 rounded-xl py-4 items-center justify-center">
					<View className="flex-row items-center">
						<LuChartColumn size={20} color="gray" className="mr-2"></LuChartColumn>
						<Text className="text-gray-700 text-base">View History</Text>
					</View>
				</TouchableOpacity>
			</View>

			<View className="h-12"></View>

		</ScrollView>
	);
}

export default JointPositionSenseSummary;
