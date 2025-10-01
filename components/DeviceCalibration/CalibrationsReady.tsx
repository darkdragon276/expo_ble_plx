import { Animated, Pressable, Text, View } from 'react-native'
import { useRef } from 'react'
import { Feather } from "@expo/vector-icons";
import { styled } from "nativewind";
// import LinearGradient from "react-native-linear-gradient";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from 'react-redux';
import { updateStep, resetStep } from '../../store/redux/calibrationStepSlice';

const FtherIcon = styled(Feather)

const CalibrationsReady = ({ runProgress }: any) => {
	const scale = useRef(new Animated.Value(1)).current;
	const dispatch = useDispatch();

	const onPressIn = () => {
		Animated.spring(scale, {
			toValue: 0.95,
			useNativeDriver: true,
		}).start();
	};

	const onPressOut = () => {
		Animated.spring(scale, {
			toValue: 1,
			friction: 3,
			tension: 40,
			useNativeDriver: true,
		}).start();
	};

	const RunCalibrationProgress = () => {
		dispatch(resetStep())
		runProgress(true)
	};

	return (
		<Animated.View className="py-6" style={{ transform: [{ scale }] }}>
			<Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={RunCalibrationProgress}>
				<LinearGradient
					colors={["#0066FF", "#00C853"]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					className="items-center justify-center-safe rounded-xl m-auto"
				>
					<View className="flex-row items-center justify-center px-4 py-3">
						<FtherIcon className="mr-5" name="check-circle" size={15} color="white"></FtherIcon>
						<Text className="text-white font-semibold text-base">
							Start Calibration Process
						</Text>
					</View>
				</LinearGradient>
			</Pressable>
		</Animated.View>
	)
}

export default CalibrationsReady