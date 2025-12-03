import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const MarkerCursor = ({ id, x, y, z }: { id: string, x: number, y: number, z: number | null }) => {

	const rotate = `${z}deg`;

	return (
		<View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
			style={[
				styles.cursor,
				{
					transform: [
						{ translateX: -1 },
						{ translateY: -1 },
						{ translateX: x },
						{ translateY: y * (-1) },
						{ rotate: rotate }
					],
				},
			]}
		>
			<View className="absolute w-6 h-0.5 bg-purple-600 opacity-75" />
			<View className="absolute h-6 w-0.5 bg-purple-600 opacity-75" />
			<View className="absolute -top-7 bg-purple-600 rounded-xl w-5 h-5 items-center justify-center">
				<Text className="text-white text-xsfont-medium shadow-sm">{id}</Text>
			</View>
		</View>
	)
}

export default MarkerCursor

const styles = StyleSheet.create({
	cursor: {
		position: 'absolute',
		width: 2,
		height: 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
})