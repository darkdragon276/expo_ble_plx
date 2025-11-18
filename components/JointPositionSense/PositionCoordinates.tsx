import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Circle, Line } from 'react-native-svg'

const PositionCoordinates = ({ children }: { children: any }) => {

	return (
		<>
			<Svg className="absolute inset-0 w-full h-full" viewBox="0 0 192 192">
				{/* Circles */}
				<Circle
					cx="96"
					cy="96"
					r="25"
					fill="none"
					stroke="#e5e7eb"
					strokeWidth="1"
					strokeDasharray="2,2"
				/>
				<Circle
					cx="96"
					cy="96"
					r="45"
					fill="none"
					stroke="#d1d5db"
					strokeWidth="1"
					strokeDasharray="2,2"
				/>
				<Circle
					cx="96"
					cy="96"
					r="65"
					fill="none"
					stroke="#9ca3af"
					strokeWidth="1"
					strokeDasharray="2,2"
				/>
				<Circle
					cx="96"
					cy="96"
					r="85"
					fill="none"
					stroke="#6b7280"
					strokeWidth="1"
					strokeDasharray="2,2"
				/>
				{/* Cross lines */}
				<Line
					x1="96"
					y1="11"
					x2="96"
					y2="181"
					stroke="#9ca3af"
					strokeWidth="1"
					strokeDasharray="4,2"
				/>
				<Line
					x1="11"
					y1="96"
					x2="181"
					y2="96"
					stroke="#9ca3af"
					strokeWidth="1"
					strokeDasharray="4,2"
				/>
				{/* Diagonals */}
				<Line
					x1="29"
					y1="29"
					x2="163"
					y2="163"
					stroke="#d1d5db"
					strokeWidth="1"
					strokeDasharray="2,4"
				/>
				<Line
					x1="163"
					y1="29"
					x2="29"
					y2="163"
					stroke="#d1d5db"
					strokeWidth="1"
					strokeDasharray="2,4"
				/>
				<Circle cx="96" cy="96" r="4" stroke="white" strokeWidth="1" fill="#155dfc" />
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
		</>
	)
}

export default PositionCoordinates

const styles = StyleSheet.create({})