import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../../model/RootStackParamList';
import { MakerCursorProps, type LiveHeadPositionProps, type LiveRecorded } from '../../model/JointPosition';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import LiveCursor from './LiveCursor';
import HeadPosition from './HeadPosition';
import { LucideTarget, LucideCircleCheckBig, LucideCircle } from 'lucide-react-native';
import { styled } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import HeadPositionRecorded from './HeadPositionRecorded';
import PositionCoordinates from './PositionCoordinates';
import MarkerCursor from './MarkerCursor';
import MakerCursorList from './MakerCursorList';
import { ChildROMRef } from '../../model/ChildRefGetValue';
import { useDatabase } from '../../db/useDatabase';
import { DB_INSERT_JPS, DB_SELECT_ALL_JPS } from '../../db/dbQuery';
import { getCurrentDateTime } from '../../utils/getDateTime';

type NavigationProp = StackNavigationProp<RootStackParamList>;
const LuTarget = styled(LucideTarget);
const LuCircleCheckBig = styled(LucideCircleCheckBig);
const LuCircle = styled(LucideCircle);

const dummyMarkerCursor: MakerCursorProps[] = [
	{
		id: "1",
		x: 15.5,
		y: -57.3,
	},
	{
		id: "2",
		x: -68.1,
		y: -39.9,
	}
]

const LiveHeadPosition = ({ isReset, refDuration, record }: { isReset: React.RefObject<boolean>, refDuration: React.RefObject<ChildROMRef | null>, record: boolean }) => {
	const navigation = useNavigation<NavigationProp>();
	const refPosition = useRef<LiveHeadPositionProps>(null)

	const refRecord = useRef<LiveRecorded | any>(null);
	const refMarkerCursor = useRef<MakerCursorProps | any>(null);
	const refRecordCnt = useRef<number>(0);
	const subscribers = useRef<(() => void)[]>([]);

	const db = useDatabase("headx.db");

	useEffect(() => {

	}, []);

	const onPressRecord = async () => {
		refRecordCnt.current += 1;
		refRecord.current = {
			id: refRecordCnt.current.toString(),
			horizontal: refPosition.current ? refPosition.current.horizontal : 0,
			vertical: refPosition.current ? refPosition.current.vertical : 0,
			current: refPosition.current ? refPosition.current.current : "",
			time: refDuration.current ? refDuration.current.getValue() : "",
			angular: (refPosition.current && refPosition.current) ? Math.hypot(refPosition.current.horizontal, refPosition.current.vertical).toFixed(1) : 0
		};

		refMarkerCursor.current = {
			id: refRecordCnt.current.toString(),
			x: refPosition.current ? refPosition.current.horizontal : 0,
			y: refPosition.current ? refPosition.current.vertical : 0,
			z: 0
		};

		try {
			const key: string = Date.now().toString();
			let NowObj = { localShortDateTime: "", strNow: "" };
			NowObj.strNow = getCurrentDateTime().strNowISO;
			NowObj.localShortDateTime = getCurrentDateTime().localShortDateTime;

			addJPSData(key, NowObj, refRecord.current);

		} catch (e) { }

		subscribers.current.forEach((fn) => fn());
	};

	const subscribe = (fn: () => void) => {
		subscribers.current.push(fn);
	};

	const addJPSData = async (key: string, nowObj: { localShortDateTime: string, strNow: string }, record: LiveRecorded) => {
		if (!db) {
			return;
		}

		//let { title } = route.params;
		let title = "test JPS";
		const dt: string = nowObj.strNow;
		const type: string = "JPS";

		if (title == "") {
			title = `ROM Session - ${nowObj.localShortDateTime}`;
		}

		await db.runAsync(DB_INSERT_JPS, [key, title, dt, type, record.horizontal, record.vertical, record.angular, record.current, record.time ? record.time : 0]);

		const rs = await db.getAllAsync(DB_SELECT_ALL_JPS);
		console.log(rs)
	};

	return (
		<View className="space-y-6">

			<View className="bg-white p-4 space-y-6 rounded-2xl items-center shadow-md mt-4">

				<View className="flex-row items-center justify-center space-x-2 mb-4">
					<LuTarget size={15} className="text-gray-500"></LuTarget>
					<Text className="text-lg font-semibold">Live Head Position Preview</Text>
				</View>

				<HeadPosition dataRef={refPosition}></HeadPosition>

				{/* svg */}
				<View className="relative w-48 h-48 mx-auto my-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full border-2 border-gray-300 shadow-inner">

					<PositionCoordinates>
						<LiveCursor dataRef={refPosition} reset={isReset} record={record}></LiveCursor>
						<MakerCursorList mode={"LIVE"} getData={() => refMarkerCursor ? refMarkerCursor.current : []} subscribe={subscribe} data={dummyMarkerCursor}></MakerCursorList>
					</PositionCoordinates>

					<>
						{/* <Svg className="absolute inset-0 w-full h-full" viewBox="0 0 192 192">
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
						<LiveCursor dataRef={refPosition} reset={isReset} record={record}></LiveCursor>
					</View>

					<View className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
						<MarkerCursor x={15.5} y={-57.3}></MarkerCursor>
					</View>

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
					</View> */}
					</>
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

			{
				record
					?
					<View className="flex-row space-x-2">
						<TouchableOpacity
							onPress={onPressRecord}
							activeOpacity={0.9}
							className="rounded-xl overflow-hidden border border-gray-200 shadow w-1/2">
							<LinearGradient
								colors={["#1447e6", "#007595"]}
								start={[0, 0]}
								end={[1, 0]}
								className="flex-row items-center justify-center py-4 px-8"
							>
								<LuCircle size={20} color="white"></LuCircle>
								<Text className="text-white font-semibold p-3">Record Position</Text>
							</LinearGradient>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => { }}
							activeOpacity={0.9}
							className="rounded-xl overflow-hidden border border-gray-200 shadow w-1/2">
							<LinearGradient
								colors={["#f8fafc", "#f1f5f9"]}
								start={[0, 0]}
								end={[1, 0]}
								className="flex-row items-center justify-center py-4 px-8"
							>
								<LuCircleCheckBig size={20} className="text-gray-500"></LuCircleCheckBig>
								<Text className="text-gray-500 font-semibold p-3">Finish</Text>
							</LinearGradient>
						</TouchableOpacity>
					</View>
					:
					<View></View>
			}
			{
				record
					?
					<View>
						<HeadPositionRecorded getData={() => refRecord ? refRecord.current : []} subscribe={subscribe}></HeadPositionRecorded>
					</View>
					:
					<View></View>
			}

		</View>
	);
}

export default LiveHeadPosition;

const styles = StyleSheet.create({});