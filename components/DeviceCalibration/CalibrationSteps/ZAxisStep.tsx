import { styled } from "nativewind";
import { View, Text } from "react-native";
import { CircleCheckBig } from "lucide-react-native";
import CalibrationSpinning from "../../CalibrationSpinning";
import { z_asis } from "../../../dummy/calibrationStepData";

//redux zone st
import useRunZAxisStep from '../../../hooks/calibrationHook/useRunZAxisStep';
import useCheckStep from '../../../hooks/calibrationHook/useCheckStep';
import useStepColor from '../../../hooks/calibrationHook/useStepColor';
//redux zone ed

const LuCircleBig = styled(CircleCheckBig);
let data = z_asis
let IconDefault: React.FC<any> = data.Icon

const ZAxisStep = () => {
	const { stt_z_axis } = useCheckStep();
	const status = stt_z_axis
	const { statusColor, textColor } = useStepColor({ status });

	useRunZAxisStep();

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

export default ZAxisStep