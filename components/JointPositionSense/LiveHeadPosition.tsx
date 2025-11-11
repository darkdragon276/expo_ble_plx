import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { RootStackParamList } from '../../model/RootStackParamList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';

const CIRCLE_RADIUS = 85;
const CURSOR_RADIUS = 10;

type NavigationProp = StackNavigationProp<RootStackParamList>;
// interface LiveHeadPositionProps {
// 	horizontal: number;
// 	vertical: number;
// 	current: string;
// }

const horizontal = 19.7;
const vertical = -9.4;
const current = "Right Flexion";

const LiveHeadPosition = () => {
	const navigation = useNavigation<NavigationProp>();
	const [record, setRecord] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const animatedPos = useState(new Animated.ValueXY({ x: 0, y: 0 }))[0];

	const radius = 80;
	const center = radius + 10;

	// const x = center + (horizontal / 30) * radius;
	// const y = center - (vertical / 30) * radius;

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "",
			headerTitleAlign: "left",
			headerStyle: {
				elevation: 0,
				shadowOpacity: 0,
				borderBottomWidth: 0,
			},
			headerLeft: () => (
				<View className="flex-row items-center">
					<Pressable
						onPress={() => navigation.replace("AssessmentSelection")}
						className="flex-row items-center bg-gray-100 px-3 py-1 rounded-lg"
					>
						<Ionicons name="arrow-back" size={18} color="black" />
						<Text className="ml-1 text-sm font-medium">Back</Text>
					</Pressable>
				</View>
			),
			headerRight: () => {
				return record
					?
					<View className="flex-row items-center px-3 py-1 rounded-full bg-green-100 border border-green-300 mr-2">
						<View className="w-2.5 h-2.5 rounded-full bg-green-600 mr-2" />
						<Text className="text-green-600 font-medium">Recording</Text>
					</View>
					:
					<></>;
			}
		});
	}, [navigation, record]);

	// dummy position
	useEffect(() => {
		const interval = setInterval(() => {
			const t = Date.now() / 1000;
			const x = 100 * Math.cos(t);
			const y = 120 * Math.sin(t * 1.5);
			updateCursorPosition(x, y);
		}, 50);

		return () => clearInterval(interval);
	}, []);

	// limits within a circle
	const updateCursorPosition = (x: any, y: any) => {
		const distance = Math.sqrt(x * x + y * y);

		let newX = x;
		let newY = y;

		// if out of circle then scale again
		if (distance > CIRCLE_RADIUS - CURSOR_RADIUS) {
			const ratio = (CIRCLE_RADIUS - CURSOR_RADIUS) / distance;
			newX = x * ratio;
			newY = y * ratio;
		}

		// update position
		Animated.spring(animatedPos, {
			toValue: { x: newX, y: newY },
			useNativeDriver: false,
			speed: 8,
		}).start();

		setPosition({ x: newX, y: newY });
	};

	return (
		<View className="bg-white rounded-2xl items-center shadow-md mt-4">
			<Text className="text-lg font-semibold mb-2">
				Live Head Position Preview
			</Text>

			<View className="flex-row justify-between w-full mb-3 px-4">
				<View className="items-center">
					<Text className="text-2xl font-bold text-black-600">
						{position.x.toFixed(1)}°
					</Text>
					<Text className="text-gray-500 text-sm">Horizontal</Text>
				</View>

				<View className="items-center">
					<Text className="text-2xl font-bold text-black-600">
						{position.y.toFixed(1)}°
					</Text>
					<Text className="text-gray-500 text-sm">Vertical</Text>
				</View>
			</View>

			<Text className="text-gray-700">Current: {current}</Text>

			{/* svg */}
			<View className="relative w-48 h-48 mx-auto my-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full border-2 border-gray-300 shadow-inner">
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
					<Animated.View
						style={[
							styles.cursor,
							{
								transform: [
									{ translateX: animatedPos.x },
									{ translateY: animatedPos.y },
								],
							},
						]}
					>
						<View style={styles.plusVertical} />
						<View style={styles.plusHorizontal} />
					</Animated.View>
				</View>

				{/* <View className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg border-2 border-white">
				</View> */}

				<View className="absolute -top-5 left-20 transform -translate-x-1/2 text-xs font-medium text-gray-600">
					<Text>Flexion</Text>
				</View>

				<View className="absolute -bottom-5 left-20 transform -translate-x-1/2 text-xs font-medium text-gray-600">
					<Text>Extension</Text>
				</View>

				<View className="absolute top-1/2 -left-6 transform -translate-y-1/2 text-xs font-medium text-gray-600 -rotate-90">
					<Text>Left</Text>
				</View>

				<View className="absolute top-1/2 -right-7 transform -translate-y-1/2 text-xs font-medium text-gray-600 rotate-90">
					<Text>Right</Text>
				</View>
			</View>

			<View className="flex-row space-x-3 mt-3">
				<View className="flex-row items-center">
					<View className="w-3 h-3 bg-blue-400 rounded-full mr-1" />
					<Text className="text-gray-600 text-sm">Neutral</Text>
				</View>
				<View className="flex-row items-center">
					<View className="w-3 h-3 bg-blue-700 rounded-full mr-1" />
					<Text className="text-gray-600 text-sm">Live Position</Text>
				</View>
			</View>
		</View>
	);
}

export default LiveHeadPosition;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	circle: {
		// width: CIRCLE_RADIUS * 2,
		// height: CIRCLE_RADIUS * 2,
		borderRadius: CIRCLE_RADIUS,
		borderWidth: 2,
		borderColor: 'gray',
		alignItems: 'center',
		justifyContent: 'center',
	},
	cursor: {
		position: 'absolute',
		width: CURSOR_RADIUS * 2,
		height: CURSOR_RADIUS * 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	plusVertical: {
		position: 'absolute',
		width: 2,
		height: 20,
		backgroundColor: '#155dfc',
	},
	plusHorizontal: {
		position: 'absolute',
		height: 2,
		width: 20,
		backgroundColor: '#155dfc',
	},
});