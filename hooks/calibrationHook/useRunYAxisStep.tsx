import { useEffect } from "react";
import { updateStep } from "../../store/redux/calibrationStepSlice";
import { useDispatch } from "react-redux";
import useCheckStep from "./useCheckStep";

const useRunYAxisStep = () => {
	const dispatch = useDispatch();
	const { stt_x_axis } = useCheckStep();

	useEffect(() => {
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
