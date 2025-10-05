import { useEffect } from "react";
import { updateStep } from "../../store/redux/calibrationStepSlice";
import { useDispatch } from "react-redux";
import useCheckStep from "./useCheckStep";
// import { EmitterSubscription } from "react-native";
import { bleEventEmitter } from "../../utils/BleEmitter";

const useRunYAxisStep = () => {
	const dispatch = useDispatch();
	const { stt_x_axis } = useCheckStep();

	useEffect(() => {
		////let sub: EmitterSubscription;

		// if (stt_x_axis !== "done") {
		// 	return
		// }

		// const sub = bleEventEmitter.addListener('CALIBRATION_Y', (data: number) => {
		// 	if (data !== 0) {
		// 		dispatch(updateStep({ key: "y_axis", value: "done" }))
		// 		dispatch(updateStep({ key: "z_axis", value: "active" }))
		// 	}
		// });

		// return () => {
		// 	console.log(`useRunYAxisStep sub removed`);
		// 	sub.remove();
		// };

		const fetchData = async () => {
			await new Promise(res => setTimeout(() => {
				dispatch(updateStep({ key: "y_axis", value: "done" }))
				dispatch(updateStep({ key: "z_axis", value: "active" }))
			}, 2000));
		};

		if (stt_x_axis === "done") {
			fetchData();
		}

	}, [stt_x_axis]);
}

export default useRunYAxisStep
