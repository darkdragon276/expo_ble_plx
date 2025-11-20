import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../../model/RootStackParamList';
import { MakerCursorProps, type LiveHeadPositionProps, type LiveRecorded } from '../../model/JointPosition';
import LiveCursor from './LiveCursor';
import HeadPosition from './HeadPosition';
import { LucideTarget, LucideCircleCheckBig, LucideCircle } from 'lucide-react-native';
import { styled } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import HeadPositionRecorded from './HeadPositionRecorded';
import PositionCoordinates from './PositionCoordinates';
import MakerCursorList from './MakerCursorList';
import { ChildROMRef } from '../../model/ChildRefGetValue';
import { useDatabase } from '../../db/useDatabase';
import { DB_INSERT_JPS, DB_INSERT_JPS_RECORD } from '../../db/dbQuery';
import { type JPSCommonInfo } from '../../model/JointPosition';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RProp = RouteProp<RootStackParamList, "JointPositionSense">;

const LuTarget = styled(LucideTarget);
const LuCircleCheckBig = styled(LucideCircleCheckBig);
const LuCircle = styled(LucideCircle);

const LiveHeadPosition = ({ isReset, refDuration, record, baseInfo }: { isReset: React.RefObject<boolean>, refDuration: React.RefObject<ChildROMRef | null>, record: boolean, baseInfo?: JPSCommonInfo | null }) => {
	const navigation = useNavigation<NavigationProp>();
	const refPosition = useRef<LiveHeadPositionProps>(null)

	const refRecord = useRef<LiveRecorded | any>(null);
	const refMarkerCursor = useRef<MakerCursorProps | any>(null);
	const dataRefScale = useRef<any>(null);
	const refRecordCnt = useRef<number>(0);
	const subscribers = useRef<(() => void)[]>([]);

	const db = useDatabase("headx.db");
	const route = useRoute<RProp>();

	useEffect(() => { }, []);

	const onPressFinish = async () => {
		navigation.replace("JointPositionSenseSummary", { key: baseInfo?.key ?? "" })
	}

	const onPressRecord = async () => {
		refRecordCnt.current += 1;
		refRecord.current = {
			id: refRecordCnt.current.toString(),
			horizontal: refPosition.current ? refPosition.current.horizontal : 0,
			vertical: refPosition.current ? refPosition.current.vertical : 0,
			pst_txt: refPosition.current ? refPosition.current.pst_txt : "",
			time: refDuration.current ? refDuration.current.getValue() : "",
			angular: (refPosition.current && refPosition.current) ? Math.hypot(refPosition.current.horizontal, refPosition.current.vertical).toFixed(1) : 0
		};

		refMarkerCursor.current = {
			id: refRecordCnt.current.toString(),
			x: dataRefScale.current ? dataRefScale.current.horizontal : 0,
			y: dataRefScale.current ? dataRefScale.current.vertical : 0,
			z: dataRefScale.current ? dataRefScale.current.rotate : 0,
		};

		try {
			addJPSData(refRecord.current, refMarkerCursor.current);

		} catch (e) { }

		subscribers.current.forEach((fn) => fn());
	};

	const subscribe = (fn: () => void) => {
		subscribers.current.push(fn);
	};

	const addJPSData = async (record: LiveRecorded, cursorScale: MakerCursorProps) => {
		if (!db) {
			return;
		}

		let { title } = route.params;
		if (title == "") {
			title = `JPS Session - ${baseInfo?.nowObj.localShortDateTime ?? ""}`;
		}

		const key = baseInfo?.key ?? "";
		const dt: string = baseInfo?.nowObj.strNow ?? ""
		const idSession = baseInfo?.idSession ?? ""

		await db.withTransactionAsync(async () => {
			if (refRecordCnt.current <= 1) {
				await db.runAsync(DB_INSERT_JPS, [key, idSession, title, dt, "JPS"]);
			}
			await db.runAsync(DB_INSERT_JPS_RECORD, [idSession, refRecordCnt.current, record.horizontal, cursorScale.x, record.vertical, cursorScale.y, cursorScale.z, record.angular, record.pst_txt, record.time ? record.time : 0]);
		});
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
				<View className="relative w-48 h-48 mx-auto my-6 rounded-full shadow-inner">
					<PositionCoordinates>
						<LiveCursor dataRef={refPosition} reset={isReset} record={record} dataRefScale={dataRefScale}></LiveCursor>
						<MakerCursorList mode={"LIVE"} getData={() => refMarkerCursor ? refMarkerCursor.current : []} subscribe={subscribe} data={[]}></MakerCursorList>
					</PositionCoordinates>
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
							onPress={onPressFinish}
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