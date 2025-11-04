import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CartesianChart, Line, PointsArray, useChartPressState, useLinePath } from 'victory-native';
import { useFont, Circle, Path, Canvas, Text as SKText } from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { styled } from 'nativewind';
import { RotateCcw } from 'lucide-react-native';
import type { DataROMProp } from "../../model/AssessmentHistory";

// const LuDownload = styled(LucideDownload);
const LuRotateCcw = styled(RotateCcw);

const colors = {
	extension: "#10b981",
	flexion: "#3b82f6",
	l_rotation: "#f59e0b",
	r_rotation: "#ef4444",
	l_lateral: "#8b5cf6",
	r_lateral: "#06b6d4",
};

const ToolTip = ({ x
	, y
	, font
	, valToolTipDate
	, valToolTipExtension
	, valToolTipFlexion
	, valToolTipLRotation
	, valToolTipRRotation
	, valToolTipLLateral
	, valToolTipRlateral }:
	{
		x: SharedValue<number>; y: any, font: any
		, valToolTipDate: any
		, valToolTipExtension: any
		, valToolTipFlexion: any
		, valToolTipLRotation: any
		, valToolTipRRotation: any
		, valToolTipLLateral: any
		, valToolTipRlateral: any
	}) => {

	return (
		<>
			<SKText x={40} y={20} font={font} text={valToolTipDate} />
			<SKText x={40} y={30} font={font} text={valToolTipExtension} color={colors.extension} />
			<SKText x={40} y={40} font={font} text={valToolTipFlexion} color={colors.flexion} />
			<SKText x={40} y={50} font={font} text={valToolTipLRotation} color={colors.l_rotation} />
			<SKText x={40} y={60} font={font} text={valToolTipRRotation} color={colors.r_rotation} />
			<SKText x={40} y={70} font={font} text={valToolTipLLateral} color={colors.l_lateral} />
			<SKText x={40} y={80} font={font} text={valToolTipRlateral} color={colors.r_lateral} />

			<Circle cx={x} cy={y.extension.position} r={5} color={colors.extension} />
			<Circle cx={x} cy={y.flexion.position} r={5} color={colors.flexion} />
			<Circle cx={x} cy={y.l_lateral.position} r={5} color={colors.l_lateral} />
			<Circle cx={x} cy={y.l_rotation.position} r={5} color={colors.l_rotation} />
			<Circle cx={x} cy={y.r_rotation.position} r={5} color={colors.r_rotation} />
			<Circle cx={x} cy={y.r_lateral.position} r={5} color={colors.r_lateral} />
		</>
	)
}

const AssessmentHistorROMChart = ({ dataChart }: { dataChart: DataROMProp[] }) => {

	const [data, setData] = useState<DataROMProp[]>([])
	const font = useFont(require("../../assets/fonts/calibrii.ttf"), 12);
	const { state, isActive } = useChartPressState({ x: 0, y: { extension: 0, flexion: 0, l_lateral: 0, l_rotation: 0, r_lateral: 0, r_rotation: 0 } });

	const valToolTipDate = useDerivedValue((): string => {
		let date = "";
		const index = state.x.value.value;
		if (data[index]) {
			date = data[index].date_str;
		}
		return date
	}, [state, data])


	const valToolTipExtension = useDerivedValue((): string => {
		return "Extension (°) : " + state.y.extension.value.value.toString();
	}, [state])

	const valToolTipFlexion = useDerivedValue((): string => {
		return "Flexion (°) : " + state.y.flexion.value.value.toString();
	}, [state])

	const valToolTipLRotation = useDerivedValue((): string => {
		return "Left Rotation (°) : " + state.y.l_rotation.value.value.toString();
	}, [state])

	const valToolTipRRotation = useDerivedValue((): string => {
		return "Right Rotation (°) : " + state.y.r_rotation.value.value.toString();
	}, [state])

	const valToolTipLLateral = useDerivedValue((): string => {
		return "Left Lateral (°) : " + state.y.l_lateral.value.value.toString();
	}, [state])

	const valToolTipRlateral = useDerivedValue((): string => {
		return "Right Lateral (°) : " + state.y.r_lateral.value.value.toString();
	}, [state])

	useEffect(() => {
		setData(dataChart);
	}, [dataChart])

	// const NaturalLine = ({ points, color, strokeWidth }: { points: PointsArray, color: string, strokeWidth: number }) => {
	// 	const { path } = useLinePath(points, { curveType: "natural" });
	// 	return <Path path={path} style="stroke" strokeWidth={strokeWidth} color={color} />;
	// }

	return (
		<View className="bg-white rounded-2xl shadow-sm p-2 mb-2" style={{ height: 400 }}>
			<View className="flex-row items-center">
				<View className="items-center justify-center mr-3">
					<LuRotateCcw size={20} className="text-purple-500"></LuRotateCcw>
				</View>
				<Text className="text-xl">Range of Motion Progress</Text>
			</View>
			<CartesianChart
				data={data}
				xKey="xIndex"
				yKeys={['extension', 'flexion', 'l_lateral', 'l_rotation', 'r_lateral', 'r_rotation']}
				padding={{ left: 10, top: 10 }}
				chartPressState={state}
				axisOptions={{
					font,
					labelColor: '#333',
					tickCount: {
						x: 4,
						y: 6
					},
					tickValues: {
						x: data.map((d) => d.xIndex),
						y: [0, 60, 100, 140, 180],
					},
					formatXLabel: (index) => {
						let date = data[index].date_str;
						return date
					}
				}}
			>
				{({ points }) => (
					<>
						<Line points={points.extension} color={colors.extension} strokeWidth={2} />
						<Line points={points.flexion} color={colors.flexion} strokeWidth={2} />
						<Line points={points.l_lateral} color={colors.l_lateral} strokeWidth={2} />
						<Line points={points.l_rotation} color={colors.l_rotation} strokeWidth={2} />
						<Line points={points.r_lateral} color={colors.r_lateral} strokeWidth={2} />
						<Line points={points.r_rotation} color={colors.r_rotation} strokeWidth={2} />
						{isActive && (
							<ToolTip
								x={state.x.position}
								y={state.y}
								font={font}
								valToolTipDate={valToolTipDate}
								valToolTipExtension={valToolTipExtension}
								valToolTipFlexion={valToolTipFlexion}
								valToolTipLRotation={valToolTipLRotation}
								valToolTipRRotation={valToolTipRRotation}
								valToolTipLLateral={valToolTipLLateral}
								valToolTipRlateral={valToolTipRlateral}
							/>
						)}

					</>
				)}
			</CartesianChart>
			{/* Legend */}
			<View className="flex-row flex-wrap justify-center">
				{[
					["Extension (°)", colors.extension],
					["Flexion (°)", colors.flexion],
					["Left Rotation (°)", colors.l_lateral],
					["Right Rotation (°)", colors.l_rotation],
					["Left Side Flex (°)", colors.r_lateral],
					["Right Side Flex (°)", colors.r_rotation],
				].map(([label, color], idx) => (
					<View key={idx} className="flex-row items-center m-1">
						<View className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: color }} />
						<Text className="text-[10px] text-gray-600">{label}</Text>
					</View>
				))}
			</View>
		</View>
	)
}

export default AssessmentHistorROMChart

const styles = StyleSheet.create({})