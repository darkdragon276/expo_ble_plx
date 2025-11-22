import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Circle } from 'react-native-svg'

const PositionCoordinates = ({ children }: { children: any }) => {

	return (
		<>
			<Svg className="absolute inset-0 w-full h-full" viewBox="0 0 192 192">
				{/* Circles */}
				<Circle
					cx="96"
					cy="96"
					r="96"
					fill="#e53935"
					stroke="black"
					strokeWidth="1"
				/>
				<Circle
					cx="96"
					cy="96"
					r="72"
					fill="#fff176"
					stroke="black"
					strokeWidth="1"
				/>
				<Circle
					cx="96"
					cy="96"
					r="48"
					fill="#66bb6a"
					stroke="black"
					strokeWidth="1"
				/>
				<Circle
					cx="96"
					cy="96"
					r="32"
					fill="#66bb6a"
					stroke="black"
					strokeWidth="1"
				/>

				<Circle
					cx="96"
					cy="96"
					r="16"
					fill="#66bb6a"
					stroke="black"
					strokeWidth="1"
				/>
				<Circle cx="96" cy="96" r="3" strokeWidth="1" fill="black" />
			</Svg>

			<View className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				{children}
			</View>

			<View className="absolute -bottom-5 left-20 transform -translate-x-1/2 text-xs font-medium text-gray-600">
				<Text>Flexion</Text>
			</View>

			<View className="absolute -top-5 left-20 transform -translate-x-1/2 text-xs font-medium text-gray-600">
				<Text>Extension</Text>
			</View>

			<View className="absolute top-1/2 -left-6 transform -translate-y-1/2 text-xs font-medium text-gray-600 -rotate-90">
				<Text>Left</Text>
			</View>

			<View className="absolute top-1/2 -right-7 transform -translate-y-1/2 text-xs font-medium text-gray-600 rotate-90">
				<Text>Right</Text>
			</View>

			<View style={styles.c1}>
				<Text>1°</Text>
			</View>

			<View className="absolute text-xs font-sm text-gray-600" style={styles.c2}>
				<Text>2°</Text>
			</View>

			<View className="absolute text-xs font-sm text-gray-600" style={styles.c3}>
				<Text>3°</Text>
			</View>

			<View className="absolute text-xs font-sm text-gray-600" style={styles.c4}>
				<Text>4.5°</Text>
			</View>

			<View className="absolute text-xs font-sm text-gray-600" style={styles.c5}>
				<Text>6°</Text>
			</View>
		</>
	)
}

export default PositionCoordinates

const styles = StyleSheet.create({
	c1: {
		position: "absolute",
		fontSize: 1,
		transform: [{ translateX: 100 }, { translateY: 90 }],
	},
	c2: {
		position: "absolute",
		fontSize: 1,
		transform: [{ translateX: 115 }, { translateY: 90 }],
	}
	,
	c3: {
		position: "absolute",
		fontSize: 1,
		transform: [{ translateX: 130 }, { translateY: 90 }],
	}
	,
	c4: {
		position: "absolute",
		fontSize: 1,
		transform: [{ translateX: 145 }, { translateY: 90 }],
	}
	,
	c5: {
		position: "absolute",
		fontSize: 1,
		transform: [{ translateX: 175 }, { translateY: 90 }],
	}
})