import { styled } from "nativewind";
import { View, Text } from "react-native";
import { CircleCheckBig } from "lucide-react-native";
import CalibrationSpinning from "../CalibrationSpinning";
import { x_asis } from "../../../dummy/calibrationStepData";

//redux zone st
import useRunXAxisStep from '../../../hooks/calibrationHook/useRunXAxisStep';
import useCheckStep from '../../../hooks/calibrationHook/useCheckStep';
import useStepColor from '../../../hooks/calibrationHook/useStepColor';
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { bleEventEmitter } from "../../../utils/BleEmitter";
import { updateStep } from "../../../store/redux/calibrationStepSlice";
//redux zone ed

const LuCircleBig = styled(CircleCheckBig);
let data = x_asis
let IconDefault: React.FC<any> = data.Icon

const XAxisStep = ({ xAxis }: { xAxis: string }) => {
	//const { stt_x_axis } = useCheckStep();
	const status = xAxis
	const { statusColor, textColor } = useStepColor({ status });

	//useRunXAxisStep();

	// const dispatch = useDispatch();
	// const { stt_hold_dv } = useCheckStep();

	// useEffect(() => {
	// 	//let sub: EmitterSubscription;

	// 	// if (stt_hold_dv !== "done") {
	// 	// 	return;
	// 	// }

	// 	const sub = bleEventEmitter.addListener('CALIBRATION_CONNECT_DEVICE', (data: number) => {
	// 		const { stt_hold_dv } = useCheckStep();
	// 		if (stt_hold_dv === "done") {
	// 			if (data) {
	// 				dispatch(updateStep({ key: "x_axis", value: "done" }))
	// 				dispatch(updateStep({ key: "y_axis", value: "active" }))
	// 			}
	// 		}

	// 	});

	// 	return () => {
	// 		//console.log(`useRunXAxisStep sub removed`);
	// 		sub.remove();
	// 	};
	// }, [stt_hold_dv]);

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

export default XAxisStep