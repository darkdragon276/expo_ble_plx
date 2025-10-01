//redux zone st
import { type IRootState } from "../../model/IRootState";
import { useSelector } from "react-redux";
//redux zone ed

const useGetMotions = () => {
	const startRecording = useSelector((state: IRootState) => state.rangeOfMotion.startRecording)
	const extension = useSelector((state: IRootState) => state.rangeOfMotion.extension)
	const flexion = useSelector((state: IRootState) => state.rangeOfMotion.flexion)
	const l_rotation = useSelector((state: IRootState) => state.rangeOfMotion.l_rotation)
	const r_rotation = useSelector((state: IRootState) => state.rangeOfMotion.r_rotation)
	const l_lateral = useSelector((state: IRootState) => state.rangeOfMotion.l_lateral)
	const r_lateral = useSelector((state: IRootState) => state.rangeOfMotion.r_lateral)
	const duration = useSelector((state: IRootState) => state.rangeOfMotion.duration)

	return {
		startRecording,
		extension,
		flexion,
		l_rotation,
		r_rotation,
		l_lateral,
		r_lateral,
		duration,
	}
}

export default useGetMotions