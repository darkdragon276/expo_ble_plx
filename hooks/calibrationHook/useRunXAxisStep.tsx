import { useEffect } from "react";
import { updateStep } from "../../store/redux/calibrationStepSlice";
import { useDispatch } from "react-redux";
import useCheckStep from "./useCheckStep";
// import { EmitterSubscription } from "react-native";
// import { bleEventEmitter } from "../../utils/BleEmitter";

const useRunXAxisStep = () => {
	const dispatch = useDispatch();
	const { stt_hold_dv } = useCheckStep();

	useEffect(() => {
		////let sub: EmitterSubscription;

		// if (stt_hold_dv !== "done") {
		// 	return;
		// }

		// const sub = bleEventEmitter.addListener('CALIBRATION_X', (data: number) => {
		// 	//console.log(`useRunXAxisStep: ${data}`);
		// 	if (data !== 0) {
		// 		dispatch(updateStep({ key: "x_axis", value: "done" }))
		// 		dispatch(updateStep({ key: "y_axis", value: "active" }))
		// 	}
		// });

		// return () => {
		// 	console.log(`useRunXAxisStep sub removed`);
		// 	sub.remove();
		// };

		const fetchData = async () => {
			await new Promise(res => setTimeout(() => {
				dispatch(updateStep({ key: "x_axis", value: "done" }))
				dispatch(updateStep({ key: "y_axis", value: "active" }))
			}, 2000));
		};

		if (stt_hold_dv === "done") {
			fetchData();
		}

	}, [stt_hold_dv]);
}

export default useRunXAxisStep
