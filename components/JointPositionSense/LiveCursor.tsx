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
import { CURSOR_ADJUST_OFFSET, CIRCLE_MAX_RADIUS, CIRCLE_LIMIT, SCALE_PERCENT } from '../../dummy/Constants';

const CIRCLE_RADIUS = CIRCLE_MAX_RADIUS;
const CURSOR_RADIUS = CURSOR_ADJUST_OFFSET;

type NavigationProp = StackNavigationProp<RootStackParamList>;

const degreesArray: number[] = [0, 30, 45, 60, 90, 120, 135, 150, 180, 360];

const LiveCursor = ({ dataRef, reset, record, dataRefScale }: { dataRef: React.RefObject<LiveHeadPositionProps | null>, reset: React.RefObject<boolean>, record: boolean, dataRefScale: React.RefObject<LiveHeadPositionProps | null> }) => {
	const navigation = useNavigation<NavigationProp>();
	const animatedPos = useState(new Animated.ValueXY({ x: 0, y: 0 }))[0];
	const animatedRotate = useRef(new Animated.Value(0)).current;
	const rotateAnim = useRef(new Animated.Value(0)).current;
	const rotate = rotateAnim.interpolate({
		inputRange: [0, Math.PI * 2],
		outputRange: ["0rad", `${2 * Math.PI}rad`],
	});
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
		// 	updateCursorPosition(x, y, 0);
		// }, 50);

		if (BLEService.deviceId === null) {
			Alert.alert('Device disconnected', `Force stop JPS session!`, [
				{
					text: 'OK',
					onPress: () => navigation.replace("Main"),
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
			let x, y, z;
			if (data) {
				krossDevice.unpack(data);

				x = krossDevice.angle.yaw;
				y = krossDevice.angle.pitch;
				z = krossDevice.angle.roll;

				if (reset.current) {
					OffsetX.current = 0;
					OffsetY.current = 0;
					reStart();
				}

				x = getHorizontalOffset(x);
				y = getVerticalOffset(y);
				z = getRote(z);
				updateCursorPosition(x, y, z);
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
	const updateCursorPosition = (x: number, y: number, z: number) => {
		const distance = Math.sqrt(x * x + y * y);

		let newX = x;
		let newY = y;

		let Circle_X = x;
		let Circle_Y = y;

		// if out of circle then scale again
		// if (distance > CIRCLE_RADIUS - CURSOR_RADIUS) {
		// 	const ratio = (CIRCLE_RADIUS - CURSOR_RADIUS) / distance;
		// 	newX = x * ratio;
		// 	newY = y * ratio;
		// }

		//const distance2 = Math.sqrt(Circle_X * Circle_X + Circle_Y * Circle_Y);
		const distance2 = Math.sqrt(Circle_X * Circle_X + Circle_Y * Circle_Y);
		if (distance2 > CIRCLE_LIMIT) {
			const ratio = 20 / distance2;
			Circle_X = x * ratio;
			Circle_Y = y * ratio;

			//if (Math.abs(newX) < CIRCLE_LIMIT) {
			//Circle_X = newX
			//}

			//if (Math.abs(newY) < CIRCLE_LIMIT) {
			//Circle_Y = newY
			//}
		}

		//console.log(`Circle_X: ${Math.round(Circle_X * 10) / 10} + newX: ${newX}, Circle_Y: ${Math.round(Circle_Y * 10) / 10 * (-1)} + newY: ${newY}`)

		// update position
		//Animated.parallel([
		Animated.spring(animatedPos, {
			toValue: { x: Circle_X, y: Circle_Y * (-1) },
			useNativeDriver: false,
			stiffness: 90,
			damping: 20,
			mass: 1,
			overshootClamping: true,
			restSpeedThreshold: 0.1,
			restDisplacementThreshold: 0.1,
		}).start();

		// , Animated.timing(animatedRotate, {
		// 	toValue: z,
		// 	duration: 500,
		// 	useNativeDriver: true,
		// })
		// ]).start(() => {
		// 	animatedRotate.setValue(0); // reset để xoay tiếp lần sau
		// });

		let newZ = degToRadRounded(normalizeAngle360(z));

		Animated.timing(rotateAnim, {
			toValue: 0,
			duration: 100,
			useNativeDriver: false,
		}).start();

		dataRef.current = {
			horizontal: newX,
			vertical: newY,
			current: getCurrentPositionText(x, y)
		};

		dataRefScale.current = {
			horizontal: Circle_X,
			vertical: Circle_Y,
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
			OffsetX.current = Math.round(x);
		}

		let alpha = normalizeAngle(Math.round(x * 10) / 10 - OffsetX.current);
		return (Math.round(alpha * 10) / 10);
	};

	const getVerticalOffset = (y: number): number => {
		if (OffsetY.current === null || OffsetY.current === 0) {
			OffsetY.current = Math.round(y);
		}

		let alpha = normalizeAngle(Math.round(y * 10) / 10 - OffsetY.current);
		return (Math.round(alpha * 10) / 10);
	};

	const getRote = (z: number): number => {
		return (Math.round(z * 10) / 10);
	}

	const degToRadRounded = (degrees: number, roundTo: number = 30): number => {
		const roundedDeg = Math.round(degrees / roundTo) * roundTo;
		return roundedDeg * (Math.PI / 180);
	}

	const normalizeAngle360 = (angle: number): number => {
		let normalized = angle % 360;
		if (normalized < 0) {
			normalized += 360;
		}
		return normalized;
	}

	return (
		<Animated.View
			style={[
				styles.cursor,
				{
					transform: [
						{ translateX: Animated.multiply(animatedPos.x, SCALE_PERCENT) },
						{ translateY: Animated.multiply(animatedPos.y, SCALE_PERCENT) },
						{ rotate },
					],
				},
			]}
		>
			<View style={!record ? styles.plusVertical : styles.plusRecordVertical} />
			<View style={!record ? styles.plusHorizontal : styles.plusRecordHorizontal} />
		</Animated.View>
	)
}

export default LiveCursor

const styles = StyleSheet.create({
	cursor: {
		position: 'absolute',
		width: 0.2,
		height: 0.2,
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