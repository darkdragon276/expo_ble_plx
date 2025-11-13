import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { type LiveRecorded } from '../../model/JointPosition';

type HeadPositionRecordedChildProps = {
	getData: () => LiveRecorded;
	subscribe: (callback: () => void) => void;
};

const SessionItem = memo(({ item }: { item: LiveRecorded }) => {
	return (
		<View className="bg-white rounded-2xl border border-gray-200 shadow-sm">
			<View className="flex-row justify-between items-center">
				<Text className="text-md font-bold">{item.current}</Text>
				<View className="flex-column items-center">
					<View
						className="px-3 py-1 rounded-full">
						<Text
							className="text-xs font-semibold">
							H: {item.horizontal.toFixed(1)}° | V: {item.vertical.toFixed(1)}°
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
});

const HeadPositionRecorded: React.FC<HeadPositionRecordedChildProps> = ({ getData, subscribe }) => {

	const [data, setData] = useState<LiveRecorded[]>([]);

	useEffect(() => {
		subscribe(() => {
			const newRecord = getData();
			if (!newRecord) return;
			setData(prevList => [...prevList, newRecord]);
		});
	}, [getData, subscribe]);

	return (
		<View className="flex-1 bg-white rounded-2xl">
			<FlatList
				data={data}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <SessionItem item={item} />}
				scrollEnabled={false}
			/>
		</View>
	)
}

export default HeadPositionRecorded

const styles = StyleSheet.create({})