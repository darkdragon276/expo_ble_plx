import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { type LiveHeadPositionProps } from '../../model/JointPosition';

const HeadPosition = ({ dataRef }: { dataRef: React.RefObject<LiveHeadPositionProps | null> }) => {

	const [position, setPosition] = useState<LiveHeadPositionProps>({ horizontal: 0, vertical: 0, rotate: 0, pst_txt: "" });

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
			<View className="flex-row justify-between w-full px-10 mb-1">
				<View className="items-center">
					<Text className="text-2xl font-black text-black-600"
						style={{
							fontVariant: ['tabular-nums'],
							minWidth: 100,
							textAlign: 'center'
						}}>
						{position.horizontal.toFixed(1)}°
					</Text>
					<Text className="text-gray-500 text-xs">Horizontal</Text>
				</View>

				<View className="items-center">
					<Text className="text-2xl font-black text-black-600"
						style={{
							fontVariant: ['tabular-nums'],
							minWidth: 100,
							textAlign: 'center'
						}}>
						{position.vertical.toFixed(1)}°
					</Text>
					<Text className="text-gray-500 text-xs">Vertical</Text>
				</View>
			</View>

			<Text className="text-gray-500"
				style={{
					fontVariant: ['tabular-nums'],
					minWidth: 120,
					textAlign: 'center'
				}}>Current: {position.pst_txt}</Text>
		</>
	)
}

export default HeadPosition

const styles = StyleSheet.create({})