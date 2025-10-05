import { useEffect } from "react";
import { updateStep } from "../../store/redux/calibrationStepSlice";
import { useDispatch } from "react-redux";
import useCheckStep from "./useCheckStep";
// import { EmitterSubscription } from "react-native";
import { bleEventEmitter } from "../../utils/BleEmitter";

const useRunHoldDvStep = () => {
	const dispatch = useDispatch();
	const { stt_ss_init } = useCheckStep();

	useEffect(() => {
		//let sub: EmitterSubscription;

		const sub = bleEventEmitter.addListener('CALIBRATION_CONNECT_DEVICE', (data) => {
			//console.log(`useRunHoldDvStep: ${data}`);
			if (stt_ss_init === "done") {
				if (data) {
					dispatch(updateStep({ key: "hold_dv", value: "done" }))
					dispatch(updateStep({ key: "x_axis", value: "active" }))
				}
			}
		});

		console.log(`useRunHoldDvStep ${stt_ss_init}`)

		return () => {
			//console.log(`useRunHoldDvStep sub removed`);
			sub.remove();
		};
	}, [stt_ss_init]);
}

export default useRunHoldDvStep
