import { styled } from "nativewind";
import { View, Text } from "react-native";
import { CircleCheckBig } from "lucide-react-native";
import CalibrationSpinning from "../CalibrationSpinning";
import { ss_init } from "../../../dummy/calibrationStepData";
import useCheckStep from "../../../hooks/calibrationHook/useCheckStep";
import useStepColor from "../../../hooks/calibrationHook/useStepColor";
import useRunSsInitStep from "../../../hooks/calibrationHook/useRunSsInitStep";

const LuCircleBig = styled(CircleCheckBig);
let data = ss_init
let IconDefault: React.FC<any> = data.Icon

const SensorInitializationStep = () => {
	const { stt_ss_init } = useCheckStep();
	const status = stt_ss_init
	const { statusColor, textColor } = useStepColor({ status });

	useRunSsInitStep();

	return (
		<View className={`flex-row items-center p-3 my-2 rounded-xl ${statusColor}`}>
			<View className="mr-2">
				{status === "done" ? <LuCircleBig size={20} color="green"></LuCircleBig> : status === "active" ? <CalibrationSpinning /> : <IconDefault />}
			</View>
			<View>
				<Text className={`font-bold text-base ${textColor}`}>{data.label}</Text>
				<Text className={`text-sm ${textColor}`}>{data.description}</Text>
			</View>
		</View>
	);
}

export default SensorInitializationStep