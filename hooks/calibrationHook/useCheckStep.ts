//redux zone st
import { type IRootState } from "../../model/IRootState";
import { useSelector } from "react-redux";
//redux zone ed

const useCheckStep = () => {
	const stt_cn_dv_stt = useSelector((state: IRootState) => state.calibration.cn_dv_stt)
	const stt_ss_init = useSelector((state: IRootState) => state.calibration.ss_init)
	const stt_hold_dv = useSelector((state: IRootState) => state.calibration.hold_dv)
	const stt_x_axis = useSelector((state: IRootState) => state.calibration.x_axis)
	const stt_y_axis = useSelector((state: IRootState) => state.calibration.y_axis)
	const stt_z_axis = useSelector((state: IRootState) => state.calibration.z_axis)
	const stt_c_cpl = useSelector((state: IRootState) => state.calibration.c_cpl)

	return {
		stt_cn_dv_stt,
		stt_ss_init,
		stt_hold_dv,
		stt_x_axis,
		stt_y_axis,
		stt_z_axis,
		stt_c_cpl,
	}
}

export default useCheckStep