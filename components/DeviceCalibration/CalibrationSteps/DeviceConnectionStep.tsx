import { styled } from "nativewind";
import { View, Text } from "react-native";
import { CircleCheckBig } from "lucide-react-native";
import CalibrationSpinning from "../CalibrationSpinning";
import { dv_cn } from "../../../dummy/calibrationStepData";

//redux zone st
import useRunCnDvStep from '../../../hooks/calibrationHook/useRunCnDvStep';
import useCheckStep from '../../../hooks/calibrationHook/useCheckStep';
import useStepColor from '../../../hooks/calibrationHook/useStepColor';
//redux zone ed

const LuCircleBig = styled(CircleCheckBig);
let data = dv_cn
let IconDefault: React.FC<any> = data.Icon

const DeviceConnectionStep = () => {
	const { stt_cn_dv_stt } = useCheckStep();
	const status = stt_cn_dv_stt
	const { statusColor, textColor } = useStepColor({ status });

	useRunCnDvStep();

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

export default DeviceConnectionStep