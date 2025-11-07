import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DataHistory } from '../../model/AssessmentHistory'
import { LucideTarget, LucideTrendingUp, LucideCalendar, RotateCcw } from 'lucide-react-native';
import { styled } from 'nativewind';

const LuTarget = styled(LucideTarget);
const LuRotateCcw = styled(RotateCcw);
const LuTrendingUp = styled(LucideTrendingUp);
const LuCalendar = styled(LucideCalendar);
type AssessmentHistoryTagsValue = {
	total: number,
	romCnt: number,
	jpsCnt: number,
	lastDate: string,
}

const AssessmentHistoryTags = ({ dataChart }: { dataChart: DataHistory[] }) => {

	//const [data, setData] = useState<number>(0)
	const [tags, setTagsValue] = useState<AssessmentHistoryTagsValue>({
		total: 0,
		romCnt: 0,
		jpsCnt: 0,
		lastDate: "",
	});

	useEffect(() => {
		let countROM = 0;
		let countJPS = 0;
		let countTotal = 0;
		let maxDate: string = "";

		if (dataChart.length > 0) {
			countROM = dataChart.filter(item => item.type === "ROM").length;
			countJPS = dataChart.filter(item => item.type === "JPS").length;
			countTotal = dataChart.length;
			maxDate = dataChart.reduce((latest, item) => {
				return (new Date(item.date) > new Date(latest.date) ? item : latest)
			}).date_str;
		}

		setTagsValue({
			total: countTotal,
			romCnt: countROM,
			jpsCnt: countJPS,
			lastDate: maxDate,
		})

	}, [dataChart])

	return (
		<>
			{/* Stats Section */}
			<View className="flex-row flex-wrap justify-between">
				{/* Total Sessions */}
				<View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-3">
					<Text className="text-gray-500 mb-1">Total Sessions</Text>
					<View className="flex-row justify-between items-center">
						<Text className="text-2xl font-bold text-gray-800">{tags.total}</Text>
						<LuCalendar size={22} color="#3b82f6" />
					</View>
				</View>

				{/* Latest Session */}
				<View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-3">
					<Text className="text-gray-500 mb-1">Latest Session</Text>
					<View className="flex-row justify-between items-center">
						<Text className="text-lg font-bold text-gray-800">{tags.lastDate}</Text>
						<LuTrendingUp size={22} color="#22c55e" />
					</View>
				</View>

				{/* ROM Tests */}
				<View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-3">
					<Text className="text-gray-500 mb-1">ROM Tests</Text>
					<View className="flex-row justify-between items-center">
						<Text className="text-2xl font-bold text-gray-800">{tags.romCnt}</Text>
						<LuRotateCcw size={22} color="#a855f7" />
					</View>
				</View>

				{/* JPS Tests */}
				<View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-3">
					<Text className="text-gray-500 mb-1">JPS Tests</Text>
					<View className="flex-row justify-between items-center">
						<Text className="text-2xl font-bold text-gray-800">{tags.jpsCnt}</Text>
						<LuTarget size={22} color="#f97316" />
					</View>
				</View>
			</View>
		</>
	)
}

export default AssessmentHistoryTags

const styles = StyleSheet.create({})