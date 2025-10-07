import { styled } from "nativewind";
import { View, Text } from "react-native";
import { CircleCheckBig } from "lucide-react-native";
import CalibrationSpinning from "../CalibrationSpinning";
import { y_asis } from "../../../dummy/calibrationStepData";
import useStepColor from '../../../hooks/calibrationHook/useStepColor';

const LuCircleBig = styled(CircleCheckBig);
let data = y_asis
let IconDefault: React.FC<any> = data.Icon

const YAxisStep = ({ yAxis }: { yAxis: string }) => {
	const status = yAxis
	const { statusColor, textColor } = useStepColor({ status });

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

export default YAxisStep