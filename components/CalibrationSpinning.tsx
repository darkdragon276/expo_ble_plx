import { styled } from "nativewind";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Loader2 } from "lucide-react-native";

const LuLoader2 = styled(Loader2);

export default function CalibrationSpinning() {
	const spinValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.loop(
			Animated.timing(spinValue, {
				toValue: 1,
				duration: 1000,
				easing: Easing.linear,
				useNativeDriver: true,
			})
		).start();
	}, [spinValue]);

	const spin = spinValue.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	return (
		<Animated.View style={{ transform: [{ rotate: spin }] }}>
			<LuLoader2 size={20} className="text-blue-500" />
		</Animated.View>
	);
}
