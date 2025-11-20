import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { type LiveRecorded } from '../../model/JointPosition';

type HeadPositionRecordedChildProps = {
	getData: () => LiveRecorded;
	subscribe: (callback: () => void) => void;
};

const SessionItem = memo(({ item }: { item: LiveRecorded }) => {
	return (
		<View className="flex-row justify-between items-center my-1">
			<View className="flex-row space-x-2 w-3/7">
				<View className="w-7 h-5 justify-between items-center rounded-xl bg-purple-50 border-purple-200">
					<Text className="text-md text-purple-700 font-semibold">#{item.id}</Text>
				</View>
				<Text className="text-md font-semibold">{item.pst_txt}</Text>
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
});

const HeadPositionRecorded: React.FC<HeadPositionRecordedChildProps> = ({ getData, subscribe }) => {

	const [data, setData] = useState<LiveRecorded[]>([]);

	useEffect(() => {

		subscribe(() => {
			const newRecord = getData();

			if (!newRecord)
				return;

			setData(prevList => [...prevList, newRecord]);
		});

	}, [getData, subscribe]);


	return (
		<View>
			<View className="items-center">
				<Text className="text-muted-foreground text-xs text-center mb-3">
					Record at least one position to finish assessment
				</Text>
			</View>
			{
				data.length == 0
					?
					<></>
					:
					<View className="flex-1 bg-white rounded-2xl px-6 py-2">
						<View>
							<Text className="text-muted-foreground text-md font-bold mb-3">
								Recorded Positions ({data.length})
							</Text>
						</View>

						<FlatList
							data={data}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => <SessionItem item={item} />}
							scrollEnabled={false}
						/>
					</View>
			}
		</View>
	)
}

export default HeadPositionRecorded

const styles = StyleSheet.create({})