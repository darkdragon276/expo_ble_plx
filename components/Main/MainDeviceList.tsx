import {
	Text,
	View,
	Pressable,
	Modal,
	FlatList,
	Alert,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView
} from 'react-native';
import React, { useEffect, useState, useCallback, memo } from 'react';
import { Device } from 'react-native-ble-plx';
import { LucideCheck, LucideX, PenLine } from 'lucide-react-native';
import { styled } from 'nativewind';

import MainDeviceStatus from './MainDeviceStatus';
import { BLEService } from '../../ble/BLEService';
import { KrossDevice } from '../../ble/KrossDevice';

const LuCheck = styled(LucideCheck);
const LuUnCheck = styled(LucideX);
const LuPenLine = styled(PenLine);

interface DeviceListItemProps {
	item: Device;
	isSelected: boolean;
	onSelect: (id: string) => void;
	onEdit: (id: string, name: string) => void;
}

interface DeviceEditModeProps {
	editText: string;
	onTextChange: (text: string) => void;
	onSave: () => void;
	onCancel: () => void;
}

const DeviceListItem = memo<DeviceListItemProps>(({
	item,
	isSelected,
	onSelect,
	onEdit
}) => {
	const deviceName = item.name || 'Unknown Device';

	const handleEdit = useCallback((e: any) => {
		e.stopPropagation();
		onEdit(item.id, deviceName);
	}, [item.id, deviceName, onEdit]);

	return (
		<Pressable
			onPress={() => onSelect(item.id)}
			className={`px-3 py-3 rounded-xl mb-2 ${isSelected ? 'bg-gray-50' : ''}`}
		>
			<View className="flex-row items-center justify-between">
				<View className="flex-row items-center flex-1">
					<Text className="text-gray-700">{deviceName}</Text>
					{isSelected && <LuCheck size={20} className="text-blue-500 ml-2" />}
				</View>
				{isSelected && (
					<Pressable onPress={handleEdit} hitSlop={8} className="ml-2">
						<LuPenLine size={16} className="text-blue-500" />
					</Pressable>
				)}
			</View>
		</Pressable>
	);
});

const DeviceEditMode = memo<DeviceEditModeProps>(({
	editText,
	onTextChange,
	onSave,
	onCancel
}) => {
	const handleSave = useCallback(() => {
		if (editText.trim()) onSave();
	}, [editText, onSave]);

	return (
		<View className="flex-row items-center">
			<View className="flex-1 flex-row items-center border border-blue-500 rounded-lg px-2 mr-2">
				<TextInput
					className="flex-1 text-gray-700 text-sm py-2"
					value={editText}
					onChangeText={onTextChange}
					autoFocus
					placeholderTextColor="#9ca3af"
					placeholder="Device name"
					returnKeyType="done"
					onSubmitEditing={handleSave}
				/>
			</View>
			<TouchableOpacity onPress={handleSave} activeOpacity={0.7}>
				<View className="rounded-md py-3 px-3" style={{ borderWidth: 1, borderColor: '#22c55e' }}>
					<LuCheck size={16} className="text-green-500" />
				</View>
			</TouchableOpacity>
			<View className="w-2" />
			<TouchableOpacity onPress={onCancel} activeOpacity={0.7}>
				<View className="rounded-md py-3 px-3" style={{ borderWidth: 1, borderColor: '#ef4444' }}>
					<LuUnCheck size={16} className="text-red-500" />
				</View>
			</TouchableOpacity>
		</View>
	);
});

const MainDeviceList = () => {
	const [devices, setDevices] = useState<Device[]>([]);
	const [deviceId, setSelectedDevice] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [editingDevice, setEditingDevice] = useState<string | null>(null);
	const [editText, setEditText] = useState('');
	const krossDevice = new KrossDevice();
	
	useEffect(() => {
		let updateInfo2s: NodeJS.Timeout | undefined;
		let alertShown = false;
		if (open) {
			BLEService.startSequence();
			BLEService.customsScanDevices((listDevices) => {
				setDevices([]);
				setDevices(listDevices);
			}, (error) => {
				Alert.alert('Scan multiple times', "Waiting 20s before continue scan", [
					{
						text: 'OK',
						onPress: () => {
							BLEService.isAlertShown = false;
						}
					}
				]);
			});

			updateInfo2s = setInterval(() => {
				setDevices([]);
				setDevices(BLEService.listDevices);
			}, 1000);
			setSelectedDevice(BLEService.deviceId! || ""); 
		} else {
			if (updateInfo2s) {
				clearInterval(updateInfo2s);
			}
			alertShown = false;
			BLEService.stopSequence();
		}
	}, [open]);


	const handleSelectDevice = useCallback((id: string) => {
		setSelectedDevice(id);
		BLEService.deviceId = id;
		setOpen(false);
	}, []);

	const handleEdit = useCallback((id: string, name: string) => {
		setEditingDevice(id);
		setEditText(name);
		setEditMode(true);
	}, []);

	const handleSave = useCallback(async () => {
		if (!editingDevice || !editText.trim()) return;

		try {
			const trimmedName = editText.trim();
			setDevices(prev =>
				prev.map(device =>
					device.id === editingDevice
						? { ...device, name: trimmedName } as Device
						: device
				)
			);
			await BLEService.renameDevice(editingDevice, trimmedName, krossDevice);
		} catch (error) {
			console.error('Failed to update device name:', error);
			Alert.alert('Error', 'Failed to update device name');
		} finally {
			setEditMode(false);
			setEditingDevice(null);
			setEditText('');
		}
	}, [editingDevice, editText]);

	const handleCancel = useCallback(() => {
		setEditMode(false);
		setEditingDevice(null);
		setEditText('');
	}, []);

	const handleClose = useCallback(() => {
		setOpen(false);
		handleCancel();
	}, [handleCancel]);

	const renderDeviceItem = useCallback(
		({ item }: { item: Device }) => (
			<DeviceListItem
				item={item}
				isSelected={item.id === deviceId}
				onSelect={handleSelectDevice}
				onEdit={handleEdit}
			/>
		),
		[deviceId, handleSelectDevice, handleEdit]
	);

	return (
		<View className="px-4">
			<MainDeviceStatus deviceId={deviceId} setOpen={() => setOpen(true)} />

			<Modal
				visible={open}
				animationType="fade"
				transparent
				onRequestClose={handleClose}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={{ flex: 1 }}
				>
					<Pressable
						style={{ flex: 1 }}
						onPress={handleClose}
						className="bg-black/30 justify-end"
					>
						<Pressable onPress={(e) => e.stopPropagation()}>
							<View className="bg-white rounded-t-2xl p-4">
								<Text className="text-gray-700 font-semibold mb-3">Select device</Text>

								{!editMode ? (
									<>
										<FlatList
											data={devices}
											keyExtractor={(item) => item.id}
											renderItem={renderDeviceItem}
											initialNumToRender={10}
											// ListEmptyComponent={
											// 	<View className="py-4 items-center">
											// 		<Text className="text-gray-500">No devices found</Text>
											// 		<Text className="text-gray-400 text-sm mt-1">Scanning...</Text>
											// 	</View>
											// }
										/>
										<Pressable
											onPress={handleClose}
											className="mt-2 mb-2 py-3 items-center rounded-xl bg-gray-100"
										>
											<Text className="text-gray-700 font-medium">Cancel</Text>
										</Pressable>
									</>
								) : (
									<ScrollView
										keyboardShouldPersistTaps="handled"
										showsVerticalScrollIndicator={false}
									>
										<DeviceEditMode
											editText={editText}
											onTextChange={setEditText}
											onSave={handleSave}
											onCancel={handleCancel}
										/>
									</ScrollView>
								)}
							</View>
						</Pressable>
					</Pressable>
				</KeyboardAvoidingView>
			</Modal>
		</View>
	);
};

export default MainDeviceList;