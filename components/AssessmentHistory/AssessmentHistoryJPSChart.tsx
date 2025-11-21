import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Bar, CartesianChart, ChartBounds, useChartPressState } from 'victory-native';
import { useFont, Text as SKText, vec, LinearGradient } from '@shopify/react-native-skia';
import { runOnJS, SharedValue, useAnimatedReaction, useDerivedValue } from 'react-native-reanimated';
import { styled } from 'nativewind';
import { LucideTarget } from 'lucide-react-native';
import { JPSDataHistory } from '../../model/AssessmentHistory';
import { useDatabase } from '../../db/useDatabase';
import { DB_SELECT_JPS_RECORD_CHART } from '../../db/dbQuery';

const LuTarget = styled(LucideTarget);

const ActiveValueIndicator = ({
	xPosition,
	yPosition,
	top,
	bottom,
	activeValueDate,
	valToolTipAngular,
	topOffset = 0,
	font,
	chartBounds
}: {
	xPosition: SharedValue<number>;
	yPosition: any;
	activeValueDate: SharedValue<string>;
	valToolTipAngular: SharedValue<string>;
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
			<SKText x={activeValueX} y={30 + topOffset} font={font} text={valToolTipAngular} color="#3b82f6" />
		</>
	);
};

const AssessmentHistoryJPSChart = ({ timeFilter }: { timeFilter: string }) => {

	const db = useDatabase("headx.db");
	const font = useFont(require("../../assets/fonts/calibrii.ttf"), 12);
	const { state, isActive } = useChartPressState({ x: 0, y: { angular: 0 } });
	const [data, setData] = useState<JPSDataHistory[]>([])

	const [activeItemIndex, setActiveItemIndex] = useState(0);
	useAnimatedReaction(
		() => state.matchedIndex.value,
		(matchedIndex, previous) => {
			if (matchedIndex === previous) return;
			if (matchedIndex == null || matchedIndex < 0) return -1;

			runOnJS(setActiveItemIndex)(matchedIndex);
		}
	);

	useEffect(() => {
		const selectData = async () => {
			try {
				if (!db) {
					return;
				}

				let result = await db.getAllAsync<JPSDataHistory>(DB_SELECT_JPS_RECORD_CHART);
				if (!result) {
					return;
				}

				result = convertData(result);
				result = filerConditionSearch(result, timeFilter);
				setData(result);

			} catch (error) {
				console.log(error);
			}
		};

		if (db) {
			selectData();
		}

	}, [db, timeFilter])

	const valToolTipDate = useDerivedValue((): string => {
		let date = "";
		const index = state.x.value.value;
		if (data[index]) {
			date = data[index].date_str;
		}

		return date
	}, [state, data])

	const valToolTipAngular = useDerivedValue((): string => {
		return "Angular (°) : " + state.y.angular.value.value.toString();
	}, [state])

	const convertData = (result: JPSDataHistory[]) => {
		result = result.map((item, index) => {
			const dt = new Date(item.date);

			const pad = (n: number) => n.toString().padStart(2, "0");
			const formatted =
				pad(dt.getMonth() + 1) +
				pad(dt.getDate()) +
				dt.getFullYear() +
				pad(dt.getHours()) +
				pad(dt.getMinutes()) +
				pad(dt.getSeconds());

			const asNumber = Number(formatted);
			const asString = `${pad(dt.getMonth() + 1)}/${pad(dt.getDate())}/${dt.getFullYear()}`;
			const timeStr = `${pad(dt.getHours())}:${pad(dt.getMinutes())}`;

			return {
				...item
				, xIndex: index
				, date_str: asString
				, time_str: timeStr
				, date_n: asNumber
				, dt: dt
			};
		});

		return result;
	};

	const filerConditionSearch = (result: JPSDataHistory[], timeFilter: string) => {
		// filter date
		let date = new Date();
		let lastDay;
		switch (timeFilter) {
			case "last_week":
				date.setDate(date.getDate() - 7);
				break;
			case "last_month":
				date.setMonth(date.getMonth() - 1);
				lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
				date.setDate(lastDay);
				break;

			case "last_3_month":
				date.setMonth(date.getMonth() - 3);
				lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
				date.setDate(lastDay);
				break;

			default:
				break;
		}

		if (timeFilter !== "all") {
			result = result.filter(item => {
				return item.dt > date;
			})
		}

		return result;
	};

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
				yKeys={["angular"]}
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
						y: [0, 60, 100, 140, 180],
					},
					formatXLabel: (index) => {
						let value = "";
						if (data[index]) {
							value = data[index].date_str;
						}
						return value.substring(0, 10);
					}
				}}
			>
				{({ points, chartBounds }) => {
					return points.angular.map((p, i) => {
						return (
							<Bar
								barCount={points.angular.length}
								key={i}
								points={[p]}
								chartBounds={chartBounds}
							>
								{i === activeItemIndex && isActive ? (
									<LinearGradient
										start={vec(0, 0)}
										end={vec(0, 400)}
										colors={["#3b82f6"]}
									/>
								) : (
									<LinearGradient
										start={vec(0, 0)}
										end={vec(0, 400)}
										colors={["#10b981"]}
									/>
								)}

								{isActive && (
									<ActiveValueIndicator
										xPosition={state.x.position}
										yPosition={state.y}
										bottom={chartBounds.bottom}
										top={chartBounds.top}
										font={font}
										activeValueDate={valToolTipDate}
										valToolTipAngular={valToolTipAngular}
										topOffset={0}
										chartBounds={chartBounds}
									/>
								)}
							</Bar>
						);
					});
				}}
			</CartesianChart>
			{/* Legend */}
			<View className="flex-row justify-center mt-3 space-x-4">
				{/* <View className="flex-row items-center space-x-2">
					<View className="w-3 h-3 bg-blue-500" />
					<Text className="text-xs text-gray-700">Mean Error (°)</Text>
				</View> */}
				<View className="flex-row items-center space-x-2">
					<View className="w-3 h-3 bg-green-500" />
					<Text className="text-xs text-gray-700">Angular (°)</Text>
				</View>
			</View>
		</View>
	)
}

export default AssessmentHistoryJPSChart

const styles = StyleSheet.create({})