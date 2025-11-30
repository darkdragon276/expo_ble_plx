import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { RootStackParamList } from '../../model/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styled } from 'nativewind';
import { LucideCheck, LucideTarget, LucideX, PenLine, RotateCcw } from 'lucide-react-native';
import type { DataHistory } from "../../model/AssessmentHistory";
import useConvertDateTime from '../../utils/convertDateTime';
import * as SQLite from 'expo-sqlite';
import { DB_UPDATE_BY_KEY_JPS, DB_UPDATE_BY_KEY_ROM } from '../../db/dbQuery';

type NavigationProp = StackNavigationProp<RootStackParamList>;
const LuRotateCcw = styled(RotateCcw);
const LuPenLine = styled(PenLine);
const LuCheck = styled(LucideCheck);
const LuUnCheck = styled(LucideX);
const LuTarget = styled(LucideTarget);

const TitleSummary = ({ title, dataKey, type }: { title: string, dataKey: string, type: string }) => {
	const [text, setText] = useState(title)
	const [oldtext, setOldText] = useState(title)
	const [edit, setEditText] = useState(false)

	useEffect(() => {
		setText(title)
		setOldText(title);
	}, [title])

	const rollbackTitle = () => {
		setText(oldtext);
		setEditText(false);
	}

	const saveTitle = async () => {

		const db = await SQLite.openDatabaseAsync('headx.db');

		try {
			if (!db) {
				return;
			}

			if (type == "ROM") {
				await db.runAsync(DB_UPDATE_BY_KEY_ROM, [text, dataKey]);

			} else if (type == "JPS") {
				await db.runAsync(DB_UPDATE_BY_KEY_JPS, [text, dataKey]);
			}

			setText(text);
			setOldText(text);
		} catch (error) {
		} finally {
			if (db) {
				db.closeAsync();
			}
			setEditText(false)
		}
	}

	return (
		<View className="flex-row items-center">
			{
				!edit
					?
					<View className='flex-row items-space-between'>
						<View className="flex-1">
							<Text className="w-rounded-xl font-bold text-base">{text}</Text>
						</View>
						<TouchableOpacity onPress={() => setEditText(true)}>
							<View className="">
								<LuPenLine size={20} color="gray"></LuPenLine>
							</View>
						</TouchableOpacity>
					</View>
					:
					<View className="flex-row items-space-between">
						<View className="flex-1">
							<TextInput
								className="w-rounded-xl font-bold text-base"
								defaultValue={text}
								onChangeText={newText => setText(newText)}
								placeholderTextColor="black"
							/>
						</View>
						<View className="flex-row items-space-between space-x-1">
							<TouchableOpacity onPress={saveTitle}>
								<View className="border border-green-500 rounded-md p-1 z-10">
									<LuCheck size={25} className="text-green-500"></LuCheck>
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPress={rollbackTitle}>
								<View className="border border-red-500 rounded-md p-1 z-10">
									<LuUnCheck size={25} className="text-red-500"></LuUnCheck>
								</View>
							</TouchableOpacity>
						</View>
					</View>
			}

		</View>
	)
};

const AssessmentHistorySessionItems = memo(({ item, gotoHistory }: { item: DataHistory, gotoHistory: any }) => {

	const { date_MM_dd_yyyy_at_hh_mm_ampm } = useConvertDateTime(new Date(item.date));

	return (
		<View className="bg-blue-50/40 rounded-2xl border border-gray-200 p-4 mb-3 w-full">
			{/* Header */}
			<View className="flex-row justify-between items-center mb-2">
				<View className="flex-row items-center space-x-2">
					{ /* Icon */}
					{
						item.type == "ROM"
							?
							<View className='flex-row items-center space-x-1'>
								<LuRotateCcw size={15} className="text-purple-500"></LuRotateCcw>
								<View className="bg-purple-100 px-2 py-1 rounded-full">
									<Text className="text-purple-700 font-semibold text-xs">{item.type}</Text>
								</View>
							</View>
							:
							<View className='flex-row items-center space-x-1'>
								<LuTarget size={15} className="text-orange-500"></LuTarget>
								<View className="bg-orange-100 px-2 py-1 rounded-full">
									<Text className="text-orange-700 font-semibold text-xs">{item.type}</Text>
								</View>
							</View>
					}

				</View>
				<Text className="text-gray-400 text-xs">{6} pts</Text>
			</View>

			{/* Title */}
			<TitleSummary title={item.title} dataKey={item.key} type={item.type}></TitleSummary>
			<Text className="text-gray-500 text-sm mb-3">
				{date_MM_dd_yyyy_at_hh_mm_ampm}
			</Text>

			{/* Stats */}
			{
				item.type == "ROM"
					?
					<View className="space-y-2 mb-2">
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
					:
					<View></View>
			}

			{/* Divider */}
			<View
				style={{
					borderBottomColor: '#ccc',
					borderBottomWidth: 1,
					marginVertical: 10,
				}}
			/>

			{/* Button */}
			<TouchableOpacity className="border border-blue-100 bg-blue-50 py-2 rounded-xl"
				onPress={(item) => gotoHistory(item)}
			>
				<Text className="text-blue-600 text-center font-semibold">
					View Full Report
				</Text>
			</TouchableOpacity>
		</View>
	);
});

const AssessmentHistorySessionRecent = ({ dataRecent }: { dataRecent: DataHistory[] }) => {
	const navigation = useNavigation<NavigationProp>();

	const gotoHistory = (item: DataHistory) => {
		if (item.type == "ROM") {
			navigation.replace("RangeOfMotionSummary", { key: item.key });

		} else if (item.type == "JPS") {
			navigation.replace("JointPositionSenseSummary", { key: item.key });
		}
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
				renderItem={({ item }) => <AssessmentHistorySessionItems item={item} gotoHistory={() => { gotoHistory(item) }} />}
				showsVerticalScrollIndicator={false}
				removeClippedSubviews={true}
				scrollEnabled={false}
			/>
		</View>
	)
}

export default AssessmentHistorySessionRecent

const styles = StyleSheet.create({})