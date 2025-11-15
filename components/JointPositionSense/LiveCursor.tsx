import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Alert } from 'react-native';
import { type LiveHeadPositionProps } from '../../model/JointPosition';
import { BLEService } from '../../ble/BLEService';
import { RootStackParamList } from '../../model/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { BleError, BleErrorCode, Characteristic } from 'react-native-ble-plx';
import { KrossDevice } from '../../ble/KrossDevice';
import { normalizeAngle } from '../../utils/helper';

const CIRCLE_RADIUS = 85;
const CURSOR_RADIUS = 10;

type NavigationProp = StackNavigationProp<RootStackParamList>;

const LiveCursor = ({ dataRef, reset, record }: { dataRef: React.RefObject<LiveHeadPositionProps | null>, reset: React.RefObject<boolean>, record: boolean }) => {
	const navigation = useNavigation<NavigationProp>();
	const animatedPos = useState(new Animated.ValueXY({ x: 0, y: 0 }))[0];
	const krossDevice = new KrossDevice();
	const OffsetX = useRef<number | null>(null);
	const OffsetY = useRef<number | null>(null);

	useEffect(() => {

		// const reStart = () => {
		// 	setTimeout(() => {
		// 		reset.current = false;
		// 	}, 1000);
		// }

		// // dummy position for test
		// const interval = setInterval(() => {
		// 	const t = Date.now() / 1000;
		// 	let x = 100 * Math.cos(t);
		// 	let y = 120 * Math.sin(t * 1.5);
		// 	if (reset.current) {
		// 		reStart();
		// 		x = 0;
		// 		y = 0;
		// 	}
		// 	updateCursorPosition(x, y);
		// }, 50);

		if (BLEService.deviceId === null) {
			Alert.alert('Device disconnected', `Force stop JPS session!`, [
				{
					text: 'OK',
					//onPress: () => navigation.replace("Main"),
				}
			]);
			return;
		};

		BLEService.startSequence();
		liveData();

		return () => {
			//clearInterval(interval);
			try {
				if (BLEService.getDevice() != null) {
					BLEService.cancelTransaction(BLEService.READ_DATA_TRANSACTION_ID);
				}
			} catch (cleanupError) {
				////console.error("Error to cleanup BleManager:", cleanupError);
			}
			BLEService.stopSequence();
		}
	}, []);

	const reStart = () => {
		setTimeout(() => {
			reset.current = false;
		}, 1000);
	}

	const liveData = async () => {
		const onError = (error: BleError): void => {
			if (BLEService.isDisconnectError(error) ||
				error.errorCode === BleErrorCode.CharacteristicNotifyChangeFailed ||
				error.errorCode === BleErrorCode.CharacteristicReadFailed) {
				BLEService.deviceId = null;
				Alert.alert('Device disconnected', `Force stop JPS session!`, [
					{
						text: 'OK',
						onPress: () => { rejectCauseDisconect() }
					}
				]);
			}
		};

		const onMonitor = (char: Characteristic) => {
			let data = krossDevice.onDataReceived(KrossDevice.decodeBase64(char?.value ?? ""));
			let x, y;
			if (data) {
				krossDevice.unpack(data);

				x = krossDevice.angle.yaw;
				y = krossDevice.angle.pitch

				if (reset.current) {
					OffsetX.current = 0;
					OffsetY.current = 0;
					reStart();
				}

				x = getHorizontalOffset(x);
				y = getVerticalOffset(y);
				updateCursorPosition(x, y);
			}
			//console.log("Monitor: ", char?.value);
		}

		await BLEService.discoverAllServicesAndCharacteristicsForDevice()
			.then(() => {
				BLEService.setupMonitor(BLEService.SERVICE_UUID, BLEService.DATA_OUT_UUID, onMonitor, onError, BLEService.READ_DATA_TRANSACTION_ID);
			})
			.catch((error) => {
				if (BLEService.isDisconnectError(error)) {
					BLEService.deviceId = null;
					Alert.alert('Device disconnected', `Force stop JPS session!`, [
						{
							text: 'OK',
							onPress: () => { rejectCauseDisconect() }
						}
					]);
				}
			});
	}

	const rejectCauseDisconect = async () => {
		await BLEService.cancelTransaction(BLEService.READ_DATA_TRANSACTION_ID);
		setTimeout(async () => {
			navigation.replace("Main");
		}, 50)
	};

	// limits within a circle
	const updateCursorPosition = (x: number, y: number) => {
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

		dataRef.current = {
			horizontal: newX,
			vertical: newY,
			current: getCurrentPositionText(x, y)
		};
	};

	const getCurrentPositionText = (x: number, y: number) => {
		let current = "";

		if (x <= 0) {
			current = "Left ";
		} else if (x >= 0) {
			current = "Right ";
		}

		if (y <= 0) {
			current += "Flexion ";
		} else if (y >= 0) {
			current += "Extension ";
		}

		return current;
	};

	const getHorizontalOffset = (x: number): number => {
		if (OffsetX.current === null || OffsetX.current === 0) {
			// assign ONCE the first time listener is called
			OffsetX.current = Math.round(x);
		}

		let alpha = normalizeAngle(Math.round(x * 10) / 10 - OffsetX.current);
		return (Math.round(alpha * 10) / 10);
	};

	const getVerticalOffset = (y: number): number => {
		if (OffsetY.current === null || OffsetY.current === 0) {
			// assign ONCE the first time listener is called
			OffsetY.current = Math.round(y);
		}

		let alpha = normalizeAngle(Math.round(y * 10) / 10 - OffsetY.current);
		return (Math.round(alpha * 10) / 10);
	};

	return (
		<View>
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
				<View style={!record ? styles.plusVertical : styles.plusRecordVertical} />
				<View style={!record ? styles.plusHorizontal : styles.plusRecordHorizontal} />
			</Animated.View>
		</View>
	)
}

export default LiveCursor

const styles = StyleSheet.create({
	cursor: {
		position: 'absolute',
		width: CURSOR_RADIUS * 2,
		height: CURSOR_RADIUS * 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	plusVertical: {
		position: 'absolute',
		width: 3,
		height: 20,
		backgroundColor: '#155dfc',
	},
	plusHorizontal: {
		position: 'absolute',
		height: 3,
		width: 20,
		backgroundColor: '#155dfc',
	},
	plusRecordVertical: {
		position: 'absolute',
		width: 3,
		height: 20,
		backgroundColor: '#fb2c26',
	},
	plusRecordHorizontal: {
		position: 'absolute',
		height: 3,
		width: 20,
		backgroundColor: '#fb2c26',
	},
});