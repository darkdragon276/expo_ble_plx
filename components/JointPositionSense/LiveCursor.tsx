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
import { coordinatesScaleMultiCircle } from '../../utils/helper';

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

		let newX = x;
		let newY = y;

		let { scaleX, scaleY } = coordinatesScaleMultiCircle(x, y);

		Animated.spring(animatedPos, {
			toValue: { x: scaleX, y: scaleY * (-1) },
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
			horizontal: scaleX,
			vertical: scaleY,
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
			OffsetX.current = x;
		}

		let alpha = normalizeAngle(Math.round(x * 10) / 10 - OffsetX.current);
		return (Math.round(alpha * 10) / 10);
	};

	const getVerticalOffset = (y: number): number => {
		if (OffsetY.current === null || OffsetY.current === 0) {
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
						{ translateX: -1 },
						{ translateY: -1 },
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
		width: 2,
		height: 2,
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