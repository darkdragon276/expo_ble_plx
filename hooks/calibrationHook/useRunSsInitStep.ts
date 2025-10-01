import { useEffect } from "react";
import { updateStep } from "../../store/redux/calibrationStepSlice";
import { useDispatch } from "react-redux";
import useCheckStep from "./useCheckStep";

const useRunSsInitStep = () => {
	const dispatch = useDispatch();
	const { stt_cn_dv_stt } = useCheckStep();

	useEffect(() => {
		const fetchData = async () => {
			await new Promise(res => setTimeout(() => {
				dispatch(updateStep({ key: "ss_init", value: "done" }))
				dispatch(updateStep({ key: "hold_dv", value: "active" }))
			}, 2000));
		};

		if (stt_cn_dv_stt === "done") {
			fetchData();
		}

	}, [stt_cn_dv_stt]);
}

export default useRunSsInitStep
