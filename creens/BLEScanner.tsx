import React, { JSX, useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	//NativeEventEmitter,
	//Platform,
	Alert,
	StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BleManager, Device, State } from 'react-native-ble-plx';
import { RootStackParamList } from "../model/RootStackParamList";
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Provider } from 'react-redux';

type ScannedDevice = {
	id: string;
	name: string | null;
	rssi: number | null;
	device: Device;
};
type NavigationProp = StackNavigationProp<RootStackParamList>;
export default function BLEScanner() {

	const managerRef = useRef<BleManager | null>(null);
	const [isScanning, setIsScanning] = useState(false);
	const [devicesMap, setDevicesMap] = useState<Map<string, ScannedDevice>>(new Map());
	const [, setStateVersion] = useState(0); // force re-render when map changes
	const navigation = useNavigation<NavigationProp>();

	useEffect(() => {
		let manager: BleManager;
		let sub: any;

		try {
			manager = new BleManager();
			managerRef.current = manager;

			sub = manager.onStateChange((state: State) => {
				console.log('BLE State changed:', state);
				// you can prompt user to turn on BT if state is 'PoweredOff'

				if (state === 'PoweredOff') {
					Alert.alert('Bluetooth off', 'Turn off device to Scan!');
				}
			}, true);

		} catch (error) {
			Alert.alert('Can not init BleManager');
			console.error("Can't  BleManager:", error);
		}

		return () => {
			try {
				sub.remove();
				stopScan();
				manager.destroy();
				managerRef.current = null;
			} catch (cleanupError) {
				console.error("Error to cleanup BleManager:", cleanupError);
			}
		};
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const addOrUpdateDevice = (device: Device) => {
		setDevicesMap(prev => {
			const next = new Map(prev);
			next.set(device.id, {
				id: device.id,
				name: device.name ?? device.localName ?? null,
				rssi: device.rssi ?? null,
				device,
			});
			return next;
		});
		setStateVersion(v => v + 1);
	};

	const startScan = async () => {
		const manager = managerRef.current;
		if (!manager) return;

		// Clear previous results
		setDevicesMap(new Map());

		try {
			// On iOS you don't need to request runtime permission here (Info.plist required)
			// On Android you must request ACCESS_FINE_LOCATION / BLUETOOTH_SCAN depending on SDK level.

			setIsScanning(true);

			manager.startDeviceScan(["6E400001-B5A3-F393-E0A9-E50E24DCCA9E"], { allowDuplicates: false }, (error, scannedDevice) => {
				if (error) {
					//console.warn('Scan error', error);
					Alert.alert('Scan error', `${error.message}`);
					setIsScanning(false);
					return;
				}
				if (scannedDevice) {
					addOrUpdateDevice(scannedDevice);
				}
			});

			// Auto-stop scan after 20 seconds to save battery
			setTimeout(() => {
				stopScan();
			}, 20000);
		} catch (e: any) {
			console.warn('Failed to start scan', e);
			Alert.alert('Failed to start scan', e?.message ?? String(e));
			setIsScanning(false);
		}
	};

	const stopScan = () => {
		const manager = managerRef.current;
		try {
			manager?.stopDeviceScan();
		} catch (e) {
			console.warn('stopScan error', e);
		}
		setIsScanning(false);
	};

	const connectToDevice = async (item: ScannedDevice) => {
		const { device } = item;
		try {
			stopScan();
			const connected = await device.connect();
			await connected.discoverAllServicesAndCharacteristics();
			Alert.alert('Connect sussess', `Connected to ${item.name ?? item.id}`);
			// After connecting you can read/write characteristics
		} catch (e: any) {
			console.warn('connect error', e);
			Alert.alert('connect error', e?.message ?? String(e));
		}
	};

	const onPressGotoSettings = () => {
		navigation.navigate("SettingsDevice")
	}

	const renderItem = ({ item }: { item: ScannedDevice }) => (
		<TouchableOpacity style={styles.row} onPress={() => connectToDevice(item)}>
			<View>
				<Text style={styles.name}>{item.name ?? '(Not a Name)'}</Text>
				<Text style={styles.id}>{item.id}</Text>
			</View>
			<View>
				<Text style={styles.rssi}>{item.rssi ?? '--'}</Text>
			</View>
		</TouchableOpacity>
	);

	const deviceList = Array.from(devicesMap.values()).sort((a, b) => (b.rssi ?? -999) - (a.rssi ?? -999));

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>BLE Scanner (react-native-ble-plx)</Text>
			<View style={styles.controls}>
				<TouchableOpacity
					style={[styles.button, isScanning ? styles.buttonStop : styles.buttonStart]}
					onPress={() => (isScanning ? stopScan() : startScan())}
				>
					<Text style={styles.buttonText}>{isScanning ? 'Stop scanning' : 'Start scanning'}</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.button, styles.buttonClear]}
					onPress={() => {
						setDevicesMap(new Map());
						setStateVersion(v => v + 1);
					}}
				>
					<Text style={styles.buttonText}>Delete devices</Text>
				</TouchableOpacity>
			</View>
			<TouchableOpacity
				onPress={onPressGotoSettings}
			>
				<Text style={styles.title}>Goto Main Creen</Text>
			</TouchableOpacity>
			<FlatList
				data={deviceList}
				keyExtractor={item => item.id}
				renderItem={renderItem}
				contentContainerStyle={{ paddingBottom: 48 }}
				ListEmptyComponent={() => <Text style={styles.empty}>Devices not found!</Text>}
			/>


		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
	controls: { flexDirection: 'row', gap: 8, marginBottom: 12 },
	button: { padding: 12, borderRadius: 8, minWidth: 120, alignItems: 'center' },
	buttonStart: { backgroundColor: '#0a84ff' },
	buttonStop: { backgroundColor: '#ff3b30' },
	buttonClear: { backgroundColor: '#8e8e93' },
	buttonText: { color: 'white', fontWeight: '600' },
	row: { padding: 12, borderBottomWidth: 1, borderColor: '#e5e5ea', flexDirection: 'row', justifyContent: 'space-between' },
	name: { fontSize: 16 },
	id: { fontSize: 12, color: '#6e6e73' },
	rssi: { fontSize: 14, fontWeight: '600' },
	empty: { textAlign: 'center', marginTop: 32, color: '#6e6e73' },
	footer: { marginTop: 12 },
	footerText: { fontSize: 12, color: '#8e8e93' },
});
