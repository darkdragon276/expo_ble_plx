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
			<View className="border-2 border-gray-100 bg-purple-600 rounded-xl w-5 h-5 items-center justify-center">
				<Text className="text-white text-xs font-medium shadow-sm">{id}</Text>
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