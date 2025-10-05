import { useEffect } from "react";
import { updateStep } from "../../store/redux/calibrationStepSlice";
import { useDispatch } from "react-redux";
import useCheckStep from "./useCheckStep";
import { bleEventEmitter } from "../../utils/BleEmitter";
//import { EmitterSubscription } from "react-native";

const useRunSsInitStep = () => {
	const dispatch = useDispatch();
	const { stt_cn_dv_stt } = useCheckStep();

	useEffect(() => {
		//let sub: EmitterSubscription;

		const sub = bleEventEmitter.addListener('CALIBRATION_CONNECT_DEVICE', (data) => {
			if (data) {
				//console.log(`useRunSsInitStep bleEventEmitter: ${data}`);
				if (stt_cn_dv_stt !== "done") {
					dispatch(updateStep({ key: "ss_init", value: "done" }))
					dispatch(updateStep({ key: "hold_dv", value: "active" }))
				}
			}
		});

		//console.log(`useRunSsInitStep ${stt_cn_dv_stt}`)

		return () => {
			console.log(`useRunSsInitStep sub removed`);
			sub.remove();
		};
	}, [stt_cn_dv_stt]);
}

export default useRunSsInitStep
