import { styled } from "nativewind";
import { StyleSheet, Text, View, Pressable } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colorMap, colorMapBg, type ColorVariant } from '../../model/DotStatusColor';

//const Icon = styled(Ionicons);
const MainCardDevices = ({ devices, setOpen }: any) => {

	const color: ColorVariant = devices.color
	const colorbg: ColorVariant = devices.color

	return (
		<View className="bg-white rounded-2xl p-4 shadow">
			<View className="flex-row items-center space-x-2 mb-2">
				<Text className="text-gray-700 font-semibold">Device Status</Text>
				<View className="w-20"></View>
				<View className="flex-row justify-end items-center space-x-2">
					{/* Battery icon */}
					<Ionicons name="battery-half-outline" size={18} />
					<Text className={`${colorMap[color]} font-medium`}>{devices.battery}</Text>

					{/* Status dot */}
					<View className={`w-2.5 h-2.5 rounded-full ${colorMapBg[colorbg]} ml-2`} />
					<Text className={`text-${devices.color}-600 font-medium`}>{devices.status}</Text>
				</View>
			</View>

			{/* Combobox row */}
			<Pressable
				onPress={() => setOpen(true)}
				className="flex-row items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
			>
				<View className="flex-row items-center">
					{/* green dot */}
					<View className={`w-3 h-3 rounded-full ${colorMapBg[colorbg]} mr-3`} />
					<Text className="text-gray-700">{devices.name}</Text>
				</View>

				<Text className="text-gray-400">
					<Ionicons name="chevron-down" size={15} color="gray" />
				</Text>
			</Pressable>
		</View>
	)
}

export default MainCardDevices