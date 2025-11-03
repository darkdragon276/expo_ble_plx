import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Entypo, Ionicons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { LucideFunnel } from 'lucide-react-native';

const LuFunnel = styled(LucideFunnel);

const AssessmentHistoryFilter = () => {
	const [timePeriod, setTimePeriod] = useState("All Time");
	const [metricFocus, setMetricFocus] = useState("All Metrics");
	const [openDropdown, setOpenDropdown] = useState<"time" | "metric" | null>(null);

	const timeOptions = ["All Time", "Last Week", "Last Month", "Last 3 Month"];
	const metricOptions = ["All Metrics", "ROM Tests", "JPS Tests"];

	const handleSelect = (type: "time" | "metric", value: string) => {
		if (type === "time") setTimePeriod(value);
		else setMetricFocus(value);
		setOpenDropdown(null);
	};

	return (
		<View className="bg-white rounded-2xl shadow-sm p-4 mb-2">
			{/* Header */}
			<View className="flex-row items-center mb-3">
				<LuFunnel size={18} color="#374151" />
				<Text className="ml-2 text-gray-800 font-semibold">Filters & Options</Text>
			</View>

			{/* Time Period */}
			<Text className="text-gray-700 font-semibold mb-1">Time Period</Text>
			<Pressable
				onPress={() => setOpenDropdown(openDropdown === "time" ? null : "time")}
				className="flex-row justify-between items-center py-2 border-b border-gray-100"
			>
				<Text className="text-gray-800">{timePeriod}</Text>
				<Entypo
					name={openDropdown === "time" ? "chevron-up" : "chevron-down"}
					size={16}
					color="#9ca3af"
				/>
			</Pressable>

			{/* Metric Focus */}
			<Text className="text-gray-700 font-semibold mt-4 mb-1">Metric Focus</Text>
			<Pressable
				onPress={() => setOpenDropdown(openDropdown === "metric" ? null : "metric")}
				className="flex-row justify-between items-center py-2 border-b border-gray-100"
			>
				<Text className="text-gray-800">{metricFocus}</Text>
				<Entypo
					name={openDropdown === "metric" ? "chevron-up" : "chevron-down"}
					size={16}
					color="#9ca3af"
				/>
			</Pressable>

			{/* Dropdown Overlay */}
			<Modal
				transparent
				visible={openDropdown !== null}
				animationType="fade"
				onRequestClose={() => setOpenDropdown(null)}
			>
				<Pressable
					className="flex-1 bg-black/20"
					onPress={() => setOpenDropdown(null)}
				>
					<View
						className={`absolute left-6 right-6 mt-[200px] bg-white rounded-2xl shadow-lg p-2`}
					>
						<FlatList
							data={openDropdown === "time" ? timeOptions : metricOptions}
							keyExtractor={(item) => item}
							renderItem={({ item }) => (
								<TouchableOpacity
									className="py-3 px-2 rounded-xl flex-row justify-between items-center"
									onPress={() =>
										handleSelect(openDropdown as "time" | "metric", item)
									}
								>
									<Text
										className={`${(openDropdown === "time" && item === timePeriod) ||
											(openDropdown === "metric" && item === metricFocus)
											? "text-blue-600 font-semibold"
											: "text-gray-700"
											}`}
									>
										{item}
									</Text>
									{((openDropdown === "time" && item === timePeriod) ||
										(openDropdown === "metric" && item === metricFocus)) && (
											<Ionicons name="checkmark" size={18} color="#2563eb" />
										)}
								</TouchableOpacity>
							)}
						/>
					</View>
				</Pressable>
			</Modal>
		</View>
	)
}

export default AssessmentHistoryFilter

const styles = StyleSheet.create({})