import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Circle, Line } from 'react-native-svg'

const PositionCoordinates = ({ children }: { children: any }) => {

	return (
		<>
			<Svg className="absolute inset-0 w-full h-full" viewBox="0 0 206 206">

				{/* Circles */}
				<Circle
					cx="103"
					cy="103"
					r="100"
					fill="none"
					stroke="#e5e7eb"
					strokeWidth="2"
				/>

				<Circle
					cx="103"
					cy="103"
					r="60"
					fill="#e53935"
					stroke="black"
					strokeWidth="0.5"
				/>

				<Circle
					cx="103"
					cy="103"
					r="45"
					fill="#fff176"
					stroke="black"
					strokeWidth="0.5"
				/>

				<Circle
					cx="103"
					cy="103"
					r="30"
					fill="#66bb6a"
					stroke="black"
					strokeWidth="0.5"
				/>

				<Circle
					cx="103"
					cy="103"
					r="20"
					fill="#66bb6a"
					stroke="black"
					strokeWidth="0.5"
				/>

				<Circle
					cx="103"
					cy="103"
					r="10"
					fill="#66bb6a"
					stroke="black"
					strokeWidth="0.5"
				/>

				<Line
					x1="103"
					y1="5"
					x2="103"
					y2="195"
					stroke="#9ca3af"
					strokeWidth="1"
					strokeDasharray="4,2"
				/>

				<Line
					x1="5"
					y1="103"
					x2="195"
					y2="103"
					stroke="#9ca3af"
					strokeWidth="1"
					strokeDasharray="4,2"
				/>

				<Circle cx="103" cy="103" r="3" strokeWidth="1" fill="black" />
			</Svg>

			<View className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				{children}
			</View>

			<View className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600" style={{}}>
				<Text>Flexion</Text>
			</View>

			<View className="absolute -top-7 left-20 transform -translate-x-1/2 text-xs font-medium text-gray-600">
				<Text>Extension</Text>
			</View>

			<View className="absolute top-1/2 -left-7 transform -translate-y-1/2 text-xs font-medium text-gray-600 -rotate-90">
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