import { styled } from "nativewind";
import { View, Text } from "react-native";
import { CircleCheckBig } from "lucide-react-native";
import CalibrationSpinning from "../CalibrationSpinning";
import { ss_init } from "../../../dummy/calibrationStepData";
import useCheckStep from "../../../hooks/calibrationHook/useCheckStep";
import useStepColor from "../../../hooks/calibrationHook/useStepColor";
import useRunSsInitStep from "../../../hooks/calibrationHook/useRunSsInitStep";
import { useDispatch } from "react-redux";
import { updateStep } from "../../../store/redux/calibrationStepSlice";
import { useEffect, useState } from "react";
import { bleEventEmitter } from "../../../utils/BleEmitter";

const LuCircleBig = styled(CircleCheckBig);
let data = ss_init
let IconDefault: React.FC<any> = data.Icon

const SensorInitializationStep = () => {
	const { stt_ss_init, stt_cn_dv_stt, stt_hold_dv } = useCheckStep();
	const status = stt_ss_init
	const { statusColor, textColor } = useStepColor({ status });
	const [sensorStep, SetSensorStep] = useState(false)

	//useRunSsInitStep();

	const dispatch = useDispatch();
	//const { stt_ss_init } = useCheckStep();

	console.log(`SensorInitializationStep render`);

	useEffect(() => {
		//let sub: EmitterSubscription;

		const sub = bleEventEmitter.addListener('CALIBRATION_CONNECT_DEVICE', (data) => {
			const { stt_cn_dv_stt } = useCheckStep();
			if (stt_cn_dv_stt === "done") {
				//console.log(`SensorInitializationStep: bleEventEmitter - ${stt_cn_dv_stt}`);
				if (data) {
					dispatch(updateStep({ key: "ss_init", value: "done" }))
					dispatch(updateStep({ key: "hold_dv", value: "active" }))
					console.log(`SensorInitializationStep: dispatch-ss_init done`);
					SetSensorStep(true)
				}
			}
		});

		//console.log(`SensorInitializationStep ${stt_cn_dv_stt} - ${stt_ss_init}`)

		return () => {
			//console.log(`SensorInitializationStep sub removed`);
			sub.remove();
		};
	}, [sensorStep]);

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