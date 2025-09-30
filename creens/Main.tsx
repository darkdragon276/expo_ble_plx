import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
//import { Ionicons, Feather } from '@expo/vector-icons';
import { useState } from 'react';
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../model/RootStackParamList';
//import { styled } from "nativewind";

type NavigationProp = StackNavigationProp<RootStackParamList>;

//const View = styled(View)

const Main = () => {
	const navigation = useNavigation<NavigationProp>();
	const [open, setOpen] = useState(false);

	const onPressGotoSettings = () => {
		navigation.navigate("SettingsDevice")
	}

	return (
		<SafeAreaView style={styles.AppContainer}>
			<View className="flex-row">
				<View className="flex-1"></View>
				<View className="flex-1">
					<View style={styles.ImageBox}>
						<Image style={styles.ImgSize} source={require("../assets/DarkLogo.jpg")}></Image>
					</View>
				</View>
				<View className="flex-1">
					<View className="flex-1" style={styles.BtnSettings}>
						<Pressable onPress={onPressGotoSettings}
							style={({ pressed }) => [
								{
									backgroundColor: pressed ? "lightgray" : "white",
									padding: 5,
									borderRadius: 8,
								},
							]}
						>
							{/* <Ionicons name="settings-outline" size={25} color="gray"></Ionicons> */}
						</Pressable>
					</View>
				</View>
			</View>

			<View className="p-4">
				{/* Blue action button */}
				<Pressable
					onPress={onPressGotoSettings}
					className="bg-blue-600 rounded-2xl px-4 py-4 shadow-lg"
					android_ripple={{ color: "rgba(255,255,255,0.12)" }}
				>
					<View className="flex-row items-center">
						{/* small icon circle */}
						<View className="w-10 h-10 rounded-xl bg-blue-500 items-center justify-center mr-4 shadow">
							{/* <Feather name="activity" size={15} color="white" /> */}
						</View>

						{/* text block */}
						<View className="flex-1">
							<Text className="text-white text-base font-bold">
								Start Assessment
							</Text>
							<Text className="text-blue-100 text-sm mt-1">
								Range of Motion & Joint Position Sense
							</Text>
						</View>

						{/* chevron / arrow at right */}
						<View className="ml-2">
							<Text className="text-blue-200 font-bold"></Text>
						</View>
					</View>
				</Pressable>

				{/* Spacer */}
				<View className="h-4" />
			</View>
		</SafeAreaView >
	)
}

export default Main

const styles = StyleSheet.create({
	AppContainer: {
		flex: 1,
	},
	LogoContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
	},
	ImageBox: {
		padding: 15,
		justifyContent: 'center',
		marginLeft: 'auto',
		marginRight: 'auto',
		backgroundColor: '#fff',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		borderRadius: 10,
	},
	ImgSize: {
		width: 104,
		height: 32,
	},
	BtnSettings: {
		alignItems: 'flex-end',
		justifyContent: 'center',
		marginRight: 10,
	},
});