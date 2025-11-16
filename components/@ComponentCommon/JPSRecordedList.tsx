import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { JPSRecordDataProp } from '../../model/JointPosition';

const JPSRecordedList = ({ item }: { item: JPSRecordDataProp }) => {
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

export default JPSRecordedList

const styles = StyleSheet.create({})