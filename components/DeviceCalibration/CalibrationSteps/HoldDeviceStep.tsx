import { styled } from "nativewind";
import { View, Text } from "react-native";
import { CircleCheckBig } from "lucide-react-native";
import CalibrationSpinning from "../CalibrationSpinning";
import { hold_dv } from "../../../dummy/calibrationStepData";

//redux zone st
import useRunHoldDvStep from '../../../hooks/calibrationHook/useRunHoldDvStep';
import useCheckStep from '../../../hooks/calibrationHook/useCheckStep';
import useStepColor from '../../../hooks/calibrationHook/useStepColor';
import { useDispatch } from "react-redux";
import { updateStep } from "../../../store/redux/calibrationStepSlice";
import { bleEventEmitter } from "../../../utils/BleEmitter";
import { useEffect, useState } from "react";
//redux zone ed

const LuCircleBig = styled(CircleCheckBig);
let data = hold_dv
let IconDefault: React.FC<any> = data.Icon

const HoldDeviceStep = ({ holdDeviceStep }: { holdDeviceStep: string }) => {
	//const { stt_hold_dv } = useCheckStep();
	const status = holdDeviceStep
	const { statusColor, textColor } = useStepColor({ status });
	//const [holdDeviceStep, SetHoldDeviceStep] = useState(false)

	//useRunHoldDvStep();

	// const dispatch = useDispatch();
	// //const { stt_ss_init } = useCheckStep();

	// useEffect(() => {
	// 	//let sub: EmitterSubscription;

	// 	const sub = bleEventEmitter.addListener('CALIBRATION_CONNECT_DEVICE', (data) => {
	// 		//console.log(`useRunHoldDvStep: ${data}`);
	// 		const { stt_ss_init } = useCheckStep();
	// 		if (stt_ss_init === "done") {
	// 			if (data) {
	// 				dispatch(updateStep({ key: "hold_dv", value: "done" }))
	// 				dispatch(updateStep({ key: "x_axis", value: "active" }))
	// 				SetHoldDeviceStep(true)
	// 			}
	// 		}
	// 	});

	// 	//console.log(`HoldDeviceStep - ${stt_ss_init} - ${stt_hold_dv}`)

	// 	return () => {
	// 		//console.log(`useRunHoldDvStep sub removed`);
	// 		//sub.remove();
	// 	};
	//}, [holdDeviceStep]);

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
