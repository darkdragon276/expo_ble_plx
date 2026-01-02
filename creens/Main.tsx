import { Text, View, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../model/RootStackParamList';

import MainRecentSession from '../components/Main/MainRecentSession';
import MainDeviceList from '../components/Main/MainDeviceList';

type NavigationProp = StackNavigationProp<RootStackParamList>;
const Main = () => {
	const navigation = useNavigation<NavigationProp>();
	const onPressGotoSettings = () => {
		navigation.replace("SettingsDevice")
	}

	const onPressGotoROM = () => {
		navigation.replace("AssessmentSelection")
	}

	return (
		<SafeAreaView className="flex-1">
			<View className="flex-row">
				<View className="flex-1"></View>
				<View className="flex-1">
					<View className="p-4 justify-center mx-auto mb-5 bg-white shadow-lg rounded-xl"
						style={{
							shadowColor: '#000',
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.25,
							shadowRadius: 4,
							elevation: 5,
						}}>
						<Image
							style={{ width: 104, height: 32 }}
							source={require("../assets/DarkLogo.jpg")}
						/>
					</View>
				</View>
				<View className="flex-1 items-end justify-center mr-6">
					<Pressable onPress={onPressGotoSettings}
						style={({ pressed }) => [
							{
								backgroundColor: pressed ? "lightgray" : "white",
								padding: 10,
								borderRadius: 8,
								shadowColor: '#000',
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.25,
								shadowRadius: 4,
								elevation: 5,
							},
						]}
					>
						<Ionicons name="settings-outline" size={20} color="gray"></Ionicons>
					</Pressable>
				</View>
			</View>

			<View className="p-4">
				{/* Blue action button */}
				<Pressable
					onPress={onPressGotoROM}
					className="bg-blue-600 rounded-2xl px-4 py-4 shadow-lg"
					android_ripple={{ color: "rgba(255,255,255,0.12)" }}
				>
					<View className="flex-row items-center justify-center">
						<View className="w-10 h-10 rounded-xl bg-blue-500 items-center justify-center mr-4 shadow">
							<Feather name="activity" size={15} color="white" />
						</View>
						<View>
							<Text className="text-white text-base font-bold">
								Start Assessment
							</Text>
						</View>
					</View>
				</Pressable>
			</View>

			{/* All device list */}
			<MainDeviceList></MainDeviceList>

			{/* Recent session */}
			<MainRecentSession></MainRecentSession>
		</SafeAreaView >
	)
}

export default Main