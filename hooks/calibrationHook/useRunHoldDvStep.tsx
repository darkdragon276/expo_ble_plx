import { useEffect } from "react";
import { updateStep } from "../../store/redux/calibrationStepSlice";
import { useDispatch } from "react-redux";
import useCheckStep from "./useCheckStep";

const useRunHoldDvStep = () => {
	const dispatch = useDispatch();
	const { stt_ss_init } = useCheckStep();

	useEffect(() => {
		const fetchData = async () => {
			await new Promise(res => setTimeout(() => {
				dispatch(updateStep({ key: "hold_dv", value: "done" }))
				dispatch(updateStep({ key: "x_axis", value: "active" }))
			}, 2000));
		};

		if (stt_ss_init === "done") {
			fetchData();
		}

	}, [stt_ss_init]);
}

export default useRunHoldDvStep
