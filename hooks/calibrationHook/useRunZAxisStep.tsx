import { useEffect } from "react";
import { updateStep } from "../../store/redux/calibrationStepSlice";
import { useDispatch } from "react-redux";
import useCheckStep from "./useCheckStep";

const useRunZAxisStep = () => {
	const dispatch = useDispatch();
	const { stt_y_axis } = useCheckStep();

	useEffect(() => {
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
