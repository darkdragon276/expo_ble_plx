import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { type LiveHeadPositionProps } from '../../model/JointPosition';

const HeadPosition = ({ dataRef }: { dataRef: React.RefObject<LiveHeadPositionProps | null> }) => {

	const [position, setPosition] = useState<LiveHeadPositionProps>({ horizontal: 0, vertical: 0, current: "" });

	useEffect(() => {
		const interval = setInterval(() => {
			if (dataRef.current) {
				setPosition(dataRef.current);
			}
		}, 50);

		return () => clearInterval(interval);
	}, [dataRef]);

	return (
		<>
			<View className="flex-row justify-between w-full mb-3 px-4">
				<View className="items-center">
					<Text className="text-2xl font-bold text-black-600">
						{position.horizontal.toFixed(1)}°
					</Text>
					<Text className="text-gray-500 text-sm">Horizontal</Text>
				</View>

				<View className="items-center">
					<Text className="text-2xl font-bold text-black-600">
						{position.vertical.toFixed(1)}°
					</Text>
					<Text className="text-gray-500 text-sm">Vertical</Text>
				</View>
			</View>

			<Text className="text-gray-700">Current: {position.current}</Text>
		</>
	)
}

export default HeadPosition

const styles = StyleSheet.create({})