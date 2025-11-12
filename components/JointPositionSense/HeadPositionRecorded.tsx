import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { type LiveHeadPositionProps } from '../../model/JointPosition';

interface LiveRecorded extends LiveHeadPositionProps {
	id: string
}

const SessionItem = memo(({ item }: { item: LiveRecorded }) => {

	return (
		<View className="bg-white rounded-2xl border border-gray-200 p-3 mb-3 shadow-sm">
			<View className="flex-row justify-between items-center">
				<Text className="text-md font-bold">{item.current}</Text>
				<View className="flex-column items-center">
					<View
						className="px-3 py-1 rounded-full">
						<Text
							className="text-xs font-semibold">
							H: {item.horizontal}° | H: {item.vertical}°
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
});

const HeadPositionRecorded = ({ record }: { record: React.RefObject<any> }) => {

	const [data, setData] = useState<LiveRecorded[]>([]);

	console.log(record.current)
	useEffect(() => {
		setData(prevList => [...prevList, record.current]);
	}, [record.current]);

	return (
		<View className="flex-1 bg-white rounded-2xl m-4 px-6 py-4">
			{/* <FlatList
				data={data}
				keyExtractor={(item) => item.current}
				renderItem={({ item }) => <SessionItem item={item} />}
				scrollEnabled={false}
			/> */}
		</View>
	)
}

export default HeadPositionRecorded

const styles = StyleSheet.create({})