import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Circle, Line } from 'react-native-svg'

const PositionCoordinates = ({ children }: { children: any }) => {
	const widthBox = 206;
	const heightBox = 206;
	const topLeftX = 0;
	const topLeftY = 0;
	return (
		<View className="relative w-64 h-64 my-5">
			<Svg className="absolute w-full h-full" viewBox={`${topLeftX} ${topLeftY} ${widthBox} ${heightBox}`}>
				{/* Circles */}
				<Circle
					cx={`${widthBox / 2}`}
					cy={`${heightBox / 2}`}
					r="100"
					fill="white"
					stroke="#e5e7eb"
					strokeWidth="1"
				/>

				<Circle
					cx={`${widthBox / 2}`}
					cy={`${widthBox / 2}`}
					r="60"
					fill="#e53935"
					stroke="black"
					strokeWidth="0.5"
				/>

				<Circle
					cx={`${widthBox / 2}`}
					cy={`${widthBox / 2}`}
					r="45"
					fill="#fff176"
					stroke="black"
					strokeWidth="0.5"
				/>

				<Circle
					cx={`${widthBox / 2}`}
					cy={`${widthBox / 2}`}
					r="30"
					fill="#66bb6a"
					stroke="black"
					strokeWidth="0.5"
				/>

				<Line
					x1={`${widthBox / 2}`}
					y1={`${topLeftX + 3}`}
					x2={`${widthBox / 2}`}
					y2={`${heightBox - 3}`}
					stroke="#9ca3af"
					strokeWidth="1"
					strokeDasharray="4,2"
				/>

				<Line
					x1={`${topLeftY + 3}`}
					y1={`${widthBox / 2}`}
					x2={`${widthBox - 3}`}
					y2={`${widthBox / 2}`}
					stroke="#9ca3af"
					strokeWidth="1"
					strokeDasharray="4,2"
				/>

				<Circle cx={`${widthBox / 2}`} cy={`${heightBox / 2}`} r="3" strokeWidth="1" fill="black" />
			</Svg>

			<View className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				{children}
			</View>

			<View className="absolute -bottom-4 left-0 right-0 items-center">
				<Text className="text-sm font-medium text-gray-700">
					Flexion
				</Text>
			</View>

			<View className="absolute -top-4 left-0 right-0 items-center">
				<Text className="text-sm font-medium text-gray-700">
					Extension
				</Text>
			</View>

			<View className="absolute top-0 bottom-0 -left-6 justify-center">
				<Text className="text-sm font-medium text-gray-700 -rotate-90">
					Left
				</Text>
			</View>

			<View className="absolute top-0 bottom-0 -right-7 justify-center">
				<Text className="text-sm font-medium text-gray-700 rotate-90">
					Right
				</Text>
			</View>
		</View>
	)
}

export default PositionCoordinates

const styles = StyleSheet.create({})