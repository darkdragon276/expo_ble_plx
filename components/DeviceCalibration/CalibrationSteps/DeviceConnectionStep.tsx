import { styled } from "nativewind";
import { View, Text } from "react-native";
import { CircleCheckBig } from "lucide-react-native";
import CalibrationSpinning from "../CalibrationSpinning";
import { dv_cn } from "../../../dummy/calibrationStepData";

//redux zone st
import useRunCnDvStep from '../../../hooks/calibrationHook/useRunCnDvStep';
import useCheckStep from '../../../hooks/calibrationHook/useCheckStep';
import useStepColor from '../../../hooks/calibrationHook/useStepColor';
import { useDispatch } from "react-redux";
import { updateStep } from "../../../store/redux/calibrationStepSlice";
import { bleEventEmitter } from "../../../utils/BleEmitter";
import { useEffect, useState } from "react";
//redux zone ed

const LuCircleBig = styled(CircleCheckBig);
let data = dv_cn
let IconDefault: React.FC<any> = data.Icon

//const DeviceConnectionStep = ({ connectDeviceStep }: { connectDeviceStep: string }) => {
const DeviceConnectionStep = () => {

	const { stt_cn_dv_stt } = useCheckStep();
	const status = stt_cn_dv_stt
	const { statusColor, textColor } = useStepColor({ status });
	//const [connectStep, setConnectStep] = useState(false);

	//console.log(`DeviceConnectionStep ${stt_cn_dv_stt}`);

	useRunCnDvStep();

	// const dispatch = useDispatch();

	// useEffect(() => {
	// 	dispatch(updateStep({ key: "cn_dv_stt", value: "active" }))

	// 	const sub = bleEventEmitter.addListener('CALIBRATION_CONNECT_DEVICE', (data) => {
	// 		if (data) {
	// 			//dispatch(updateStep({ key: "cn_dv_stt", value: "done" }))
	// 			//dispatch(updateStep({ key: "ss_init", value: "active" }))
	// 			//setConnectStep(true)
	// 		}
	// 	});

	// 	//console.log(`DeviceConnectionStep ${stt_cn_dv_stt} - ${stt_ss_init}`)

	// 	return () => {
	// 		//console.log(`DeviceConnectionStep sub removed`);
	// 		//sub.remove();
	// 	};
	// }, []);

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