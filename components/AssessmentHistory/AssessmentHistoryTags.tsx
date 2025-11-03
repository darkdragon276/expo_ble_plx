import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'

const AssessmentHistoryTags = () => {
	return (
		<>
			{/* Stats Section */}
			<View className="flex-row flex-wrap justify-between">
				{/* Total Sessions */}
				<View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-3">
					<Text className="text-gray-500 mb-1">Total Sessions</Text>
					<View className="flex-row justify-between items-center">
						<Text className="text-2xl font-bold text-gray-800">8</Text>
						{/* <MaterialIcons name="calendar-today" size={22} color="#3b82f6" /> */}
					</View>
				</View>

				{/* Latest Session */}
				<View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-3">
					<Text className="text-gray-500 mb-1">Latest Session</Text>
					<View className="flex-row justify-between items-center">
						<Text className="text-lg font-bold text-gray-800">10/29/2025</Text>
						<Ionicons name="trending-up-outline" size={22} color="#22c55e" />
					</View>
				</View>

				{/* ROM Tests */}
				<View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-3">
					<Text className="text-gray-500 mb-1">ROM Tests</Text>
					<View className="flex-row justify-between items-center">
						<Text className="text-2xl font-bold text-gray-800">4</Text>
						<Ionicons name="reload-circle-outline" size={22} color="#a855f7" />
					</View>
				</View>

				{/* JPS Tests */}
				<View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-3">
					<Text className="text-gray-500 mb-1">JPS Tests</Text>
					<View className="flex-row justify-between items-center">
						<Text className="text-2xl font-bold text-gray-800">4</Text>
						{/* <MaterialIcons name="my-location" size={22} color="#f97316" /> */}
					</View>
				</View>
			</View>
		</>
	)
}

export default AssessmentHistoryTags

const styles = StyleSheet.create({})