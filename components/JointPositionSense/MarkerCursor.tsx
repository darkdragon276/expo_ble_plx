import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CURSOR_RADIUS = 10;

const MarkerCursor = ({ x, y }: { x: number, y: number }) => {
	return (
		<View className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
			<View className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
				style={[
					styles.cursor,
					{
						transform: [
							{ translateX: x },
							{ translateY: y },
						],
					},
				]}
			>
				<View className="absolute w-6 h-0.5 bg-purple-600 opacity-75" />
				<View className="absolute h-6 w-0.5 bg-purple-600 opacity-75" />
				<View className="absolute -top-4">
					<View className="bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full font-medium shadow-sm">
						<Text>1</Text>
					</View>
				</View>
			</View>
		</View>
	)
}

export default MarkerCursor

const styles = StyleSheet.create({
	cursor: {
		position: 'absolute',
		width: CURSOR_RADIUS * 2,
		height: CURSOR_RADIUS * 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
})