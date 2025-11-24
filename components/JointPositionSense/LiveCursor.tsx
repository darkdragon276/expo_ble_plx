import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Alert, Easing } from 'react-native';
import { type LiveHeadPositionProps } from '../../model/JointPosition';
import { BLEService } from '../../ble/BLEService';
import { RootStackParamList } from '../../model/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { BleError, BleErrorCode, Characteristic } from 'react-native-ble-plx';
import { KrossDevice } from '../../ble/KrossDevice';
import { normalizeAngle } from '../../utils/helper';
import { CIRCLE_LIMIT, SCALE_PERCENT } from '../../dummy/Constants';
import { Circle } from 'react-native-svg';

// const CIRCLE_RADIUS = CIRCLE_MAX_RADIUS;
// const CURSOR_RADIUS = CURSOR_ADJUST_OFFSET;

type NavigationProp = StackNavigationProp<RootStackParamList>;

const LiveCursor = ({ dataRef, reset, record, dataRefScale }: { dataRef: React.RefObject<LiveHeadPositionProps | null>, reset: React.RefObject<boolean>, record: boolean, dataRefScale: React.RefObject<LiveHeadPositionProps | null> }) => {
	const navigation = useNavigation<NavigationProp>();
	const animatedPos = useState(new Animated.ValueXY({ x: 0, y: 0 }))[0];
	const rotateAnim = useRef(new Animated.Value(0)).current;
	const rotate = rotateAnim.interpolate({
		inputRange: [-90, 90],
		outputRange: ['-90deg', '90deg'],
	});
	const krossDevice = new KrossDevice();
	const OffsetX = useRef<number | null>(null);
	const OffsetY = useRef<number | null>(null);
	const OffsetZ = useRef<number | null>(null);

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
					OffsetZ.current = 0;
					reStart();
				}

				x = getHorizontalOffset(x);
				y = getVerticalOffset(y);
				z = getRoteOffset(z);
				updateCursorPosition(x, y, z);
			}
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
		//const distance = Math.sqrt(x * x + y * y);

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

		const r = Math.sqrt(Circle_X * Circle_X + Circle_Y * Circle_Y);
		
		let r2;
		if (r > CIRCLE_LIMIT) {
			r2 = 100.0
		} else if (r > 6 ) {
			r2 = 60.0 +  ((100 - 60) / (20 - 6)) * (r - 6.0);
		} else if (r > 0) {
			r2 = 10.0 * r;
		} else {
			r2 = 0;
		}

		Circle_X = r2 == 0 ? 0 : Math.round((x / r) * r2);
		Circle_Y = r2 == 0 ? 0 : Math.round((y / r) * r2);

		//console.log(`Cursor Pos: x=${Circle_X}, y=${Circle_Y}`);

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

		rotateAnim.stopAnimation(() => {
			Animated.timing(rotateAnim, {
				toValue: z,
				duration: 120,
				easing: Easing.linear,
				useNativeDriver: false,
			}).start();
		})

		dataRef.current = {
			horizontal: newX,
			vertical: newY,
			rotate: z,
			pst_txt: getCurrentPositionText(x, y)
		};

		dataRefScale.current = {
			horizontal: Circle_X,
			vertical: Circle_Y,
			rotate: z,
			pst_txt: getCurrentPositionText(x, y)
		};
	};

	const getCurrentPositionText = (x: number, y: number) => {
		let pst = "";

		if (x <= 0) {
			pst = "Left ";
		} else if (x >= 0) {
			pst = "Right ";
		}

		if (y <= 0) {
			pst += "Flexion ";
		} else if (y >= 0) {
			pst += "Extension ";
		}

		return pst;
	};

	const getHorizontalOffset = (x: number): number => {
		if (OffsetX.current === null || OffsetX.current === 0) {
			//OffsetX.current = Math.round(x);
			OffsetX.current = x;
		}

		let alpha = normalizeAngle(Math.round(x * 10) / 10 - OffsetX.current);
		return (Math.round(alpha * 10) / 10);
	};

	const getVerticalOffset = (y: number): number => {
		if (OffsetY.current === null || OffsetY.current === 0) {
			//OffsetY.current = Math.round(y);
			OffsetY.current = y;
		}

		let alpha = normalizeAngle(Math.round(y * 10) / 10 - OffsetY.current);
		return (Math.round(alpha * 10) / 10);
	};

	const getRoteOffset = (z: number): number => {
		if (OffsetZ.current === null || OffsetZ.current === 0) {
			OffsetZ.current = Math.round(z);
		}

		let alpha = normalizeAngle(Math.round(z * 10) / 10 - OffsetZ.current);
		return (Math.round((alpha) * 10) / 10);
	}

	return (
		<Animated.View
			style={[
				styles.cursor,
				{
					transform: [
						{ translateX: animatedPos.x },
						{ translateY: animatedPos.y },
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