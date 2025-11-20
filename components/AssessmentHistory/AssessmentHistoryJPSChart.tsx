import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BarGroup, CartesianChart, ChartBounds, Line, PointsArray, Scatter, useBarGroupPaths, useChartPressState, useLinePath } from 'victory-native';
import { useFont, Circle, Path, Canvas, Text as SKText, Paint, Line as SkiaLine, vec, Group, RoundedRect } from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue, useSharedValue, withDecay } from 'react-native-reanimated';
import { styled } from 'nativewind';
import { LucideTarget } from 'lucide-react-native';
import type { DataHistory } from "../../model/AssessmentHistory";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const LuTarget = styled(LucideTarget);
type DataPoint = {
	xIndex: number,
	date: string;
	meanError: number;
	variability: number;
}

const ActiveValueIndicator = ({
	xPosition,
	yPosition,
	top,
	bottom,
	activeValueDate,
	valToolTipMeanError,
	valToolTipVariability,
	topOffset = 0,
	font,
	chartBounds
}: {
	xPosition: SharedValue<number>;
	yPosition: any;
	activeValueDate: SharedValue<string>;
	valToolTipMeanError: SharedValue<string>;
	valToolTipVariability: SharedValue<string>;
	bottom: number;
	top: number;
	topOffset?: number;
	font: any;
	chartBounds: ChartBounds;
}) => {
	const start = useDerivedValue(() => vec(xPosition.value, bottom));
	const end = useDerivedValue(() =>
		vec(xPosition.value, top)
	);

	const activeValueX = useDerivedValue(
		() => {
			if (chartBounds.right - xPosition.value <= 80) {
				return xPosition.value - 80;
			}
			return xPosition.value - 10;
		}
	);

	return (
		<>
			{ /* value tooltip */}
			<SKText x={activeValueX} y={20 + topOffset} font={font} text={activeValueDate} color="black" />
			<SKText x={activeValueX} y={30 + topOffset} font={font} text={valToolTipMeanError} color="#3b82f6" />
			<SKText x={activeValueX} y={40 + topOffset} font={font} text={valToolTipVariability} color="#10b981" />
		</>
	);
};

const AssessmentHistoryJPSChart = () => {

	const font = useFont(require("../../assets/fonts/calibrii.ttf"), 12);
	const { state, isActive } = useChartPressState({ x: 0, y: { meanError: 0, variability: 0 } });

	const data: DataPoint[] = [
		{ xIndex: 1, date: "11/01/20251", meanError: 4.2, variability: 2.8 },
		{ xIndex: 2, date: "11/04/20252", meanError: 3.8, variability: 2.1 },
		{ xIndex: 3, date: "11/06/20253", meanError: 3.2, variability: 1.9 },
		{ xIndex: 4, date: "11/06/20254", meanError: 2.9, variability: 1.6 },
		{ xIndex: 5, date: "11/06/20255", meanError: 2.9, variability: 1.6 },
		{ xIndex: 6, date: "11/07/20256", meanError: 2.9, variability: 1.6 },
		{ xIndex: 7, date: "11/07/20257", meanError: 2.9, variability: 1.6 },
	];

	const valToolTipDate = useDerivedValue((): string => {
		let date = "";
		const index = state.x.value.value;
		if (data[index]) {
			date = data[index].date;
		}

		return date
	}, [state, data])

	const valToolTipMeanError = useDerivedValue((): string => {
		return "Mean Error (°) : " + state.y.meanError.value.value.toString();
	}, [state])

	const valToolTipVariability = useDerivedValue((): string => {
		return "Variability (°) : " + state.y.variability.value.value.toString();
	}, [state])

	return (
		<View className="bg-white rounded-2xl shadow-sm p-2 mb-2" style={{ height: 400 }}>
			<View className="flex-row items-center">
				<View className="items-center justify-center mr-3">
					<LuTarget size={20} className="text-orange-500"></LuTarget>
				</View>
				<Text className="text-xl">Joint Position Sense Progress</Text>
			</View>

			<CartesianChart
				data={data}
				xKey="xIndex"
				yKeys={["meanError", "variability"]}
				padding={{ left: 10, top: 10 }}
				domainPadding={{ left: 30, right: 30 }}
				chartPressState={state}
				axisOptions={{
					font,
					labelColor: '#333',
					tickCount: {
						x: 3,
						y: 5
					},
					tickValues: {
						x: data.map((d) => d.xIndex),
						y: [1, 2, 3, 4, 5],
					},
					formatXLabel: (index) => {
						let value = "";
						if (data[index]) {
							value = data[index].date;
						}
						return value.substring(0, 10);
					}
				}}
			>
				{({ points, chartBounds }) => (
					<>
						<BarGroup
							chartBounds={chartBounds}
							betweenGroupPadding={0.3}
							withinGroupPadding={0.1}
						>
							<BarGroup.Bar points={points.meanError} color="#3b82f6" />
							<BarGroup.Bar points={points.variability} color="#10b981" />
						</BarGroup>
						{isActive && (
							<ActiveValueIndicator
								xPosition={state.x.position}
								yPosition={state.y}
								bottom={chartBounds.bottom}
								top={chartBounds.top}
								font={font}
								activeValueDate={valToolTipDate}
								valToolTipMeanError={valToolTipMeanError}
								valToolTipVariability={valToolTipVariability}
								topOffset={0}
								chartBounds={chartBounds}
							/>
						)}
					</>
				)}
			</CartesianChart>
			{/* Legend */}
			<View className="flex-row justify-center mt-3 space-x-4">
				<View className="flex-row items-center space-x-2">
					<View className="w-3 h-3 bg-blue-500" />
					<Text className="text-xs text-gray-700">Mean Error (°)</Text>
				</View>
				<View className="flex-row items-center space-x-2">
					<View className="w-3 h-3 bg-green-500" />
					<Text className="text-xs text-gray-700">Variability (°)</Text>
				</View>
			</View>
		</View>
	)
}

export default AssessmentHistoryJPSChart

const styles = StyleSheet.create({})