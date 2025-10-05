import { useEffect, useState } from "react";
import { updateStep } from "../../store/redux/calibrationStepSlice";
import { useDispatch } from "react-redux";
// import { bleEventEmitter } from "../../utils/BleEmitter";

const useRunCnDvStep = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		// dispatch(updateStep({ key: "cn_dv_stt", value: "active" }))

		// //const sub = bleEventEmitter.addListener('CALIBRATION_CONNECT_DEVICE', (data) => {
		// //if (data) {
		// dispatch(updateStep({ key: "cn_dv_stt", value: "done" }))
		// dispatch(updateStep({ key: "ss_init", value: "active" }))
		// //}
		// //});

		// return () => {
		// 	//console.log(`useRunCnDvStep sub removed`);
		// 	//sub.remove();
		// };

		dispatch(updateStep({ key: "cn_dv_stt", value: "active" }))

		const fetchData = async () => {
			await new Promise(() => setTimeout(() => {
				dispatch(updateStep({ key: "cn_dv_stt", value: "done" }))
				dispatch(updateStep({ key: "ss_init", value: "active" }))
			}, 2000));
		};

		fetchData();
	}, []);
}

export default useRunCnDvStep
