import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { CartesianActionsHandle, CartesianChart, ChartBounds, Line, PointsArray, Scatter, useChartPressState, useChartTransformState, useLinePath } from 'victory-native';
import { useFont, Circle, Path, Canvas, Text as SKText, Paint, Line as SkiaLine, vec, Group, RoundedRect } from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue, useSharedValue, withDecay } from 'react-native-reanimated';
import { styled } from 'nativewind';
import { RotateCcw, X } from 'lucide-react-native';
import type { DataHistory } from "../../model/AssessmentHistory";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

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
	, chartBounds
	//, valToolTipX
	, valToolTipDate
	, valToolTipExtension
	, valToolTipFlexion
	, valToolTipLRotation
	, valToolTipRRotation
	, valToolTipLLateral
	, valToolTipRlateral }:
	{
		x: SharedValue<number>; y: any, font: any, chartBounds: ChartBounds//</number>, valToolTipX: any
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
			<Circle cx={x} cy={y.extension.position} r={3} color={colors.extension} />
			<Circle cx={x} cy={y.flexion.position} r={3} color={colors.flexion} />
			<Circle cx={x} cy={y.l_lateral.position} r={3} color={colors.l_lateral} />
			<Circle cx={x} cy={y.l_rotation.position} r={3} color={colors.l_rotation} />
			<Circle cx={x} cy={y.r_rotation.position} r={3} color={colors.r_rotation} />
			<Circle cx={x} cy={y.r_lateral.position} r={3} color={colors.r_lateral} />

			<Group
				transform={[
					{
						translateX: x.value
					},
					{
						translateY: chartBounds.top + 10,
					},
				]}
			>
				<RoundedRect
					x={40}
					y={0}
					r={10}
					width={(chartBounds.right - chartBounds.left) / 2}
					height={((chartBounds.bottom - chartBounds.top) / 2) + 10}
				>
					<Paint color="white" style="fill" />
					<Paint color="gray" style="stroke" strokeWidth={1} />
				</RoundedRect>
				<SKText x={45} y={20} font={font} text={valToolTipDate} color="black" />
				<SKText x={45} y={40} font={font} text={valToolTipExtension} color={colors.extension} />
				<SKText x={45} y={60} font={font} text={valToolTipFlexion} color={colors.flexion} />
				<SKText x={45} y={80} font={font} text={valToolTipLRotation} color={colors.l_rotation} />
				<SKText x={45} y={100} font={font} text={valToolTipRRotation} color={colors.r_rotation} />
				<SKText x={45} y={120} font={font} text={valToolTipLLateral} color={colors.l_lateral} />
				<SKText x={45} y={140} font={font} text={valToolTipRlateral} color={colors.r_lateral} />
			</Group>

			{/* <SkiaLine
				p1={{ x: xGusturePan.value, y: chartBounds.bottom }}
				p2={{ x: xGusturePan.value, y: chartBounds.top }}
			>
				<Paint color="gray" style="stroke" strokeWidth={1} />
			</SkiaLine> */}
		</>
	)
}

const ActiveValueIndicator = ({
	xPosition,
	yPosition,
	top,
	bottom,
	activeValueDate,
	activeValueExtension,
	activeValueFlexion,
	activeValueLRotation,
	activeValueRRotation,
	activeValueLLateral,
	activeValueRlateral,
	topOffset = 0,
	font,
	chartBounds
}: {
	xPosition: SharedValue<number>;
	yPosition: any;
	activeValueDate: SharedValue<string>;
	activeValueExtension: SharedValue<string>;
	activeValueFlexion: SharedValue<string>;
	activeValueLRotation: SharedValue<string>;
	activeValueRRotation: SharedValue<string>;
	activeValueLLateral: SharedValue<string>;
	activeValueRlateral: SharedValue<string>;
	bottom: number;
	top: number;
	topOffset?: number;
	font: any;
	chartBounds: ChartBounds;
}) => {
	const start = useDerivedValue(() => vec(xPosition.value, bottom));
	const end = useDerivedValue(() =>
		vec(xPosition.value, top)//top + 1.5 * FONT_SIZE + topOffset),
	);

	const activeValueX = useDerivedValue(
		() => {
			if (chartBounds.right - xPosition.value <= 100) {
				return xPosition.value - 120;
			}
			return xPosition.value + 5;
		}
	);

	return (
		<>
			{ /* straight line */}
			<SkiaLine p1={start} p2={end} strokeWidth={1} color="gray" />
			{ /* scatter */}
			<Circle cx={xPosition} cy={yPosition.extension.position} r={4} color={colors.extension} />
			<Circle cx={xPosition} cy={yPosition.flexion.position} r={4} color={colors.flexion} />
			<Circle cx={xPosition} cy={yPosition.l_lateral.position} r={4} color={colors.l_lateral} />
			<Circle cx={xPosition} cy={yPosition.l_rotation.position} r={4} color={colors.l_rotation} />
			<Circle cx={xPosition} cy={yPosition.r_rotation.position} r={4} color={colors.r_rotation} />
			<Circle cx={xPosition} cy={yPosition.r_lateral.position} r={4} color={colors.r_lateral} />
			{ /* value tooltip */}
			<SKText x={activeValueX} y={20 + topOffset} font={font} text={activeValueDate} color="black" />
			<SKText x={activeValueX} y={30 + topOffset} font={font} text={activeValueExtension} color={colors.extension} />
			<SKText x={activeValueX} y={40 + topOffset} font={font} text={activeValueFlexion} color={colors.flexion} />
			<SKText x={activeValueX} y={50 + topOffset} font={font} text={activeValueLRotation} color={colors.l_rotation} />
			<SKText x={activeValueX} y={60 + topOffset} font={font} text={activeValueRRotation} color={colors.r_rotation} />
			<SKText x={activeValueX} y={70 + topOffset} font={font} text={activeValueLLateral} color={colors.l_lateral} />
			<SKText x={activeValueX} y={80 + topOffset} font={font} text={activeValueRlateral} color={colors.r_lateral} />
		</>
	);
};

const AssessmentHistorROMChart = ({ dataChart }: { dataChart: DataHistory[] }) => {

	const [data, setData] = useState<DataHistory[]>([])
	const font = useFont(require("../../assets/fonts/calibrii.ttf"), 12);
	const { state, isActive } = useChartPressState({ x: 0, y: { extension: 0, flexion: 0, l_lateral: 0, l_rotation: 0, r_lateral: 0, r_rotation: 0 } });
	// const ref = useRef<CartesianActionsHandle<typeof state>>(null)
	//const xGusturePan = useSharedValue(0);

	// const tapGesture = Gesture.Tap().onStart((e) => {
	// 	state.isActive.value = true;
	// 	ref.current?.handleTouch(state, e.x, e.y);
	// });

	// const composed = Gesture.Race(tapGesture);
	// console.log(composed);

	// const pan =
	// 	Gesture.Pan()
	//.onStart((e) => {
	//console.log(e.x)
	//xGusturePan.value += e.x;
	//})
	//.onTouchesMove((e) => {
	//xGusturePan.value = e.x;
	//console.log()
	//console.log(e.state.toFixed(1))
	//});

	const valToolTipDate = useDerivedValue((): string => {
		let date = "";
		const index = state.x.value.value;
		if (data[index] && data[index].date_str) {
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
		const result = dataChart.filter(item => {
			return item.type == "ROM";
		})
		setData(result);
	}, [dataChart])

	const NaturalLine = ({ points, color, strokeWidth }: { points: PointsArray, color: string, strokeWidth: number }) => {
		const { path } = useLinePath(points, { curveType: "natural" });
		return (
			<>
				<Path path={path} style="stroke" strokeWidth={strokeWidth} color={color} />
				<Scatter points={points} radius={2} color="white">
					<Paint
						color={color}
						style="stroke"
						strokeWidth={2}
					/>
				</Scatter>
			</>
		)
	}

	return (
		// <GestureDetector gesture={pan}>
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
				//domainPadding={{ right: 3, left: 30, bottom: 3, top: 3 }}
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
						let date = "";
						if (data[index] && data[index].date_str) {
							date = data[index].date_str;
						}
						return date
					}
				}}
				// transformConfig={{
				// 	pan: {
				// 		enabled: true,
				// 		dimensions: ["x"],
				// 	},
				// }}
				renderOutside={({ chartBounds }) => {
					return (
						<>
							{isActive && (
								<>
									<ActiveValueIndicator
										xPosition={state.x.position}
										yPosition={state.y}
										bottom={chartBounds.bottom}
										top={chartBounds.top}
										font={font}
										activeValueDate={valToolTipDate}
										activeValueExtension={valToolTipExtension}
										activeValueFlexion={valToolTipFlexion}
										activeValueLRotation={valToolTipLRotation}
										activeValueRRotation={valToolTipRRotation}
										activeValueLLateral={valToolTipLLateral}
										activeValueRlateral={valToolTipRlateral}
										topOffset={0}
										chartBounds={chartBounds}
									/>
								</>
							)}

						</>
					);
				}}
			>
				{({ points }) => (
					<>
						<NaturalLine points={points.extension} color={colors.extension} strokeWidth={1.5} />
						<NaturalLine points={points.flexion} color={colors.flexion} strokeWidth={1.5} />
						<NaturalLine points={points.l_lateral} color={colors.l_lateral} strokeWidth={1.5} />
						<NaturalLine points={points.l_rotation} color={colors.l_rotation} strokeWidth={1.5} />
						<NaturalLine points={points.r_lateral} color={colors.r_lateral} strokeWidth={1.5} />
						<NaturalLine points={points.r_rotation} color={colors.r_rotation} strokeWidth={1.5} />
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
		// </GestureDetector>
	)
}

export default AssessmentHistorROMChart

const styles = StyleSheet.create({})