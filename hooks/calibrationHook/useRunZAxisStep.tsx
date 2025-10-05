import { useEffect } from "react";
import { updateStep } from "../../store/redux/calibrationStepSlice";
import { useDispatch } from "react-redux";
import useCheckStep from "./useCheckStep";
// import { EmitterSubscription } from "react-native";
// import { bleEventEmitter } from "../../utils/BleEmitter";

const useRunZAxisStep = () => {
	const dispatch = useDispatch();
	const { stt_y_axis } = useCheckStep();

	useEffect(() => {
		//let sub: EmitterSubscription;

		// if (stt_y_axis !== "done") {
		// 	return;
		// }

		// const sub = bleEventEmitter.addListener('CALIBRATION_Z', (data: number) => {
		// 	if (data !== 0) {
		// 		dispatch(updateStep({ key: "z_axis", value: "done" }))
		// 		dispatch(updateStep({ key: "c_cpl", value: "active" }))
		// 	}
		// });

		// return () => {
		// 	console.log(`useRunZAxisStep sub removed`);
		// 	sub.remove();
		// };

		const fetchData = async () => {
			await new Promise(res => setTimeout(() => {
				dispatch(updateStep({ key: "z_axis", value: "done" }))
				dispatch(updateStep({ key: "c_cpl", value: "active" }))
			}, 2000));
		};

		if (stt_y_axis === "done") {
			fetchData();
		}

	}, [stt_y_axis]);
}

export default useRunZAxisStep
