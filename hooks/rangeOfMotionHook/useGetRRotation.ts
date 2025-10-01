import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { interval } from "../../utils/interval";
import { updateROM } from "../../store/redux/rangeOfMotionSlice";

let randomDecimal: any;
const useGetRRotation = ({ record, pos, setPos, posMax, setPosMax }:
	{
		record: boolean,
		pos: number,
		setPos: React.Dispatch<React.SetStateAction<number>>,
		posMax: number,
		setPosMax: React.Dispatch<React.SetStateAction<number>>,
	}
) => {

	const dispatch = useDispatch();

	const runDummy = interval(async () => {
		randomDecimal = Number((Math.random() * 99).toFixed(1));

		//console.log(`useGetRRotation fetchData: ${randomDecimal}`)

		setPosMax((pos > posMax) ? pos : posMax);
		setPos(randomDecimal);
	}, 100);

	useEffect(() => {

		if (!record) {
			runDummy.stop();
			dispatch(updateROM({ key: "r_rotation", value: randomDecimal }));
			dispatch(updateROM({ key: "startRecording", value: record }))
		} else {
			runDummy.start();
			dispatch(updateROM({ key: "startRecording", value: record }))
		}

		return () => runDummy.stop();
	}, [record, pos]);
}

export default useGetRRotation
