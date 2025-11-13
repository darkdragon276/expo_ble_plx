import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Alert } from 'react-native';
import { type LiveHeadPositionProps } from '../../model/JointPosition';
import { BLEService } from '../../ble/BLEService';
import { RootStackParamList } from '../../model/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { BleError, BleErrorCode, Characteristic } from 'react-native-ble-plx';
import { KrossDevice } from '../../ble/KrossDevice';

const CIRCLE_RADIUS = 85;
const CURSOR_RADIUS = 10;

type NavigationProp = StackNavigationProp<RootStackParamList>;

const LiveCursor = ({ dataRef, reset, record }: { dataRef: React.RefObject<LiveHeadPositionProps | null>, reset: React.RefObject<boolean>, record: boolean }) => {
	const navigation = useNavigation<NavigationProp>();
	const animatedPos = useState(new Animated.ValueXY({ x: 0, y: 0 }))[0];
	const krossDevice = new KrossDevice();

	useEffect(() => {

		const reStart = () => {
			setTimeout(() => {
				reset.current = false;
			}, 1000);
		}

		// dummy position for test
		const interval = setInterval(() => {
			const t = Date.now() / 1000;
			let x = 100 * Math.cos(t);
			let y = 120 * Math.sin(t * 1.5);
			if (reset.current) {
				reStart();
				x = 0;
				y = 0;
			}
			updateCursorPosition(x, y);
		}, 50);

		if (BLEService.deviceId === null) {
			Alert.alert('Device disconnected', `Force stop ROM session!`, [
				{
					text: 'OK',
					//onPress: () => navigation.replace("Main"),
				}
			]);
			return;
		};

		// BLEService.startSequence();
		// liveData();

		return () => {
			clearInterval(interval);
			// try {
			// 	if (BLEService.getDevice() != null) {
			// 		BLEService.cancelTransaction(BLEService.READ_DATA_TRANSACTION_ID);
			// 	}
			// } catch (cleanupError) {
			// 	////console.error("Error to cleanup BleManager:", cleanupError);
			// }
			// BLEService.stopSequence();
		}
	}, []);

	const reStart = () => {
		setTimeout(() => {
			reset.current = false;
		}, 1000);
	}

	// const liveData = async () => {
	// 	const onError = (error: BleError): void => {
	// 		if (BLEService.isDisconnectError(error) ||
	// 			error.errorCode === BleErrorCode.CharacteristicNotifyChangeFailed ||
	// 			error.errorCode === BleErrorCode.CharacteristicReadFailed) {
	// 			BLEService.deviceId = null;
	// 			Alert.alert('Device disconnected', `Force stop ROM session!`, [
	// 				{
	// 					text: 'OK',
	// 					onPress: () => { rejectCauseDisconect() }
	// 				}
	// 			]);
	// 		}
	// 	};

	// 	const onMonitor = (char: Characteristic) => {
	// 		let data = krossDevice.onDataReceived(KrossDevice.decodeBase64(char?.value ?? ""));
	// 		let x, y;
	// 		if (data) {
	// 			krossDevice.unpack(data);

	// 			x = krossDevice.angle.pitch;
	// 			y = krossDevice.angle.yaw

	// 			if (reset.current) {
	// 				reStart();
	// 				x = 0;
	// 				y = 0;
	// 			}
	// 			updateCursorPosition(x, y);
	// 		}
	// 		//console.log("Monitor: ", char?.value);
	// 	}

	// 	await BLEService.discoverAllServicesAndCharacteristicsForDevice()
	// 		.then(() => {
	// 			BLEService.setupMonitor(BLEService.SERVICE_UUID, BLEService.DATA_OUT_UUID, onMonitor, onError, BLEService.READ_DATA_TRANSACTION_ID);
	// 		})
	// 		.catch((error) => {
	// 			if (BLEService.isDisconnectError(error)) {
	// 				BLEService.deviceId = null;
	// 				Alert.alert('Device disconnected', `Force stop ROM session!`, [
	// 					{
	// 						text: 'OK',
	// 						onPress: () => { rejectCauseDisconect() }
	// 					}
	// 				]);
	// 			}
	// 		});
	// }

	// const rejectCauseDisconect = async () => {
	// 	await BLEService.cancelTransaction(BLEService.READ_DATA_TRANSACTION_ID);
	// 	setTimeout(async () => {
	// 		navigation.replace("Main");
	// 	}, 50)
	// };

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
			horizontal: x,
			vertical: y,
			current: "Right Extension"
		};
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