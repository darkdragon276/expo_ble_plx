import { Text, View, Pressable, Modal, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState } from 'react';

//temp code
import { devices } from "../../dummy/devices";
import MainCardDevices from './MainCardDevices';

const MainDeviceList = () => {
	const dv = devices

	const [selected, setSelected] = useState(dv[0]);
	const [open, setOpen] = useState(false);

	return (
		<View className="px-4">
			{/* Card for device status (contains combobox) */}
			<MainCardDevices
				devices={selected}
				setOpen={() => setOpen(true)}
			>
			</MainCardDevices>

			{/* Modal for selecting device */}
			<Modal
				visible={open}
				animationType="fade"
				transparent
				onRequestClose={() => setOpen(false)}
			>
				<Pressable
					style={{ flex: 1 }}
					onPressOut={() => setOpen(false)}
					className="bg-black/30 justify-end"
				>
					<View className="bg-white rounded-t-2xl p-4">
						<Text className="text-gray-700 font-semibold mb-3">Select device</Text>

						<FlatList
							data={devices}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => (
								<Pressable
									onPress={() => {
										setSelected(item);
										setOpen(false);
									}}
									className="px-3 py-3 rounded-xl mb-2"
								>
									<View className="flex-row items-center">
										<View className={`w-2 h-2 rounded-full bg-${item.color}-500 mr-2`} />
										<Text className="text-gray-700">{item.name}</Text>
										<View className="w-4" />
										{item.id === selected.id ? (
											<Ionicons className="ml-auto text-base" name="checkmark" size={15} color="gray" />
										) : null}
									</View>
								</Pressable>
							)}
						/>
						<Pressable
							onPress={() => setOpen(false)}
							className="mt-2 py-3 items-center rounded-xl bg-gray-100"
						>
							<Text className="text-gray-700">Cancel</Text>
						</Pressable>
					</View>
				</Pressable>
			</Modal>
		</View>
	)
}

export default MainDeviceList
