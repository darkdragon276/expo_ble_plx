import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { JPSRecordDataProp } from '../../model/JointPosition';

const JPSRecordedList = ({ item }: { item: JPSRecordDataProp }) => {
	return (
		<View className="flex-row justify-between items-center mb-2">
			<View className="flex-row w-3/7">
				<View className="w-8 h-5 justify-between items-center rounded-xl bg-purple-50 border border-purple-200">
					<Text className="text-xs text-purple-700 font-black">#{item.id}</Text>
				</View>
				<Text className="text-sm font-medium ml-2">{item.pst_txt}</Text>
			</View>

			<View className="flex-row items-center">
				<Text className="text-2xl font-bold"
					style={{
						fontVariant: ['tabular-nums'],
						minWidth: 60,
						textAlign: 'right'
					}}>
					{item.angular}°
				</Text>
				<View className="w-0.5 h-6 bg-gray-500 mx-2" />
				<View className="justify-center">
					<Text className="text-xs font-regular text-gray-500"
						style={{
							fontVariant: ['tabular-nums'],
							minWidth: 55,
							textAlign: 'left'
						}}>
						V: {item.vertical.toFixed(1)}°
					</Text>
					<Text className="text-xs font-regular text-gray-500"
						style={{
							fontVariant: ['tabular-nums'],
							minWidth: 55,
							textAlign: 'left'
						}}>
						H: {item.horizontal.toFixed(1)}°
					</Text>
				</View>
			</View>
		</View>
	);
};

export default JPSRecordedList

const styles = StyleSheet.create({})