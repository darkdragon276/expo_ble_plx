import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { type LiveRecorded } from '../../model/JointPosition';

type HeadPositionRecordedChildProps = {
	getData: () => LiveRecorded;
	subscribe: (callback: () => void) => void;
};

const SessionItem = memo(({ item }: { item: LiveRecorded }) => {
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