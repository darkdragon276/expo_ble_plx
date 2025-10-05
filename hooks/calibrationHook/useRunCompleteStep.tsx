import { useEffect } from "react";
import { updateStep } from "../../store/redux/calibrationStepSlice";
import { useDispatch } from "react-redux";
import useCheckStep from "./useCheckStep";

const useRunCompleteStep = () => {
	const dispatch = useDispatch();
	const { stt_z_axis } = useCheckStep();

	useEffect(() => {
		const fetchData = async () => {
			await new Promise(res => setTimeout(() => {
				dispatch(updateStep({ key: "c_cpl", value: "done" }))
			}, 2000));
		};

		if (stt_z_axis === "done") {
			fetchData();
		}

	}, [stt_z_axis]);
}

export default useRunCompleteStep
