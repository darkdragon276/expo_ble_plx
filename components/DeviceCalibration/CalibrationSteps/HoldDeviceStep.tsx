import { styled } from "nativewind";
import { View, Text } from "react-native";
import { CircleCheckBig } from "lucide-react-native";
import CalibrationSpinning from "../CalibrationSpinning";
import { hold_dv } from "../../../dummy/calibrationStepData";

//redux zone st
import useRunHoldDvStep from '../../../hooks/calibrationHook/useRunHoldDvStep';
import useCheckStep from '../../../hooks/calibrationHook/useCheckStep';
import useStepColor from '../../../hooks/calibrationHook/useStepColor';
//redux zone ed

const LuCircleBig = styled(CircleCheckBig);
let data = hold_dv
let IconDefault: React.FC<any> = data.Icon

const HoldDeviceStep = () => {
	const { stt_hold_dv } = useCheckStep();
	const status = stt_hold_dv
	const { statusColor, textColor } = useStepColor({ status });

	useRunHoldDvStep();

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

export default HoldDeviceStep
