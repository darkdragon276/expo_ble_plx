import { useEffect } from "react";
import { updateStep } from "../../store/redux/calibrationStepSlice";
import { useDispatch } from "react-redux";
import useCheckStep from "./useCheckStep";

const useRunXAxisStep = () => {
	const dispatch = useDispatch();
	const { stt_hold_dv } = useCheckStep();

	useEffect(() => {
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
