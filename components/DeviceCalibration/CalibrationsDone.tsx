import { styled } from "nativewind";
import {
	View,
	Text,
	Pressable,
} from "react-native";
import { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CircleCheckBig } from "lucide-react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../model/RootStackParamList";

const CkCircleBig = styled(CircleCheckBig);

type NavigationProp = StackNavigationProp<RootStackParamList>;

const CalibrationsDone = () => {
	const navigation = useNavigation<NavigationProp>();

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "",
			headerTitleAlign: "left",
			headerStyle: {
				elevation: 0,
				shadowOpacity: 0,
				borderBottomWidth: 0,
			},
			headerLeft: () => (
				<View className="flex-row items-center">
					<Pressable
						onPress={() => navigation.replace("Main")}
						className="flex-row items-center bg-gray-100 px-3 py-1 rounded-lg"
					>
						<Ionicons name="arrow-back" size={18} color="black" />
						<Text className="ml-1 text-sm font-medium">Back</Text>
					</Pressable>
				</View>
			)
		});
	}, [navigation]);

	return (
		<SafeAreaView className="flex-1 justify-center items-center px-6">
			<View className="w-full rounded-xl mb-6">
				{/* Icon check */}
				<View className="w-20 h-20 rounded-full bg-green-100 justify-center items-center self-center mb-4">
					<CkCircleBig size={50} color="green" />
				</View>

				{/* Title */}
				<View className="flex-row justify-center items-center mb-2">
					<Text className="text-2xl mb-3">
						🎉 Calibration Successful!
					</Text>
				</View>

				{/* Description */}
				<Text className="text-center text-muted-foreground text-lg text-gray-500">
					Your device is now perfectly calibrated{"\n"}
					and ready for assessment
				</Text>
			</View>
		</SafeAreaView>
	)
}

export default CalibrationsDone;
