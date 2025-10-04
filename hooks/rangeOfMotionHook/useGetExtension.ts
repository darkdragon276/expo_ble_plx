import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { interval } from "../../utils/interval";
import { updateROM } from "../../store/redux/rangeOfMotionSlice";
import {KrossDevice} from "../../ble/KrossDevice";

let randomDecimal: any;

const useGetExtension = ({ record, pos, setPos, posMax, setPosMax }:
	{
		record: boolean,
		pos: number,
		setPos: React.Dispatch<React.SetStateAction<number>>,
		posMax: number,
		setPosMax: React.Dispatch<React.SetStateAction<number>>,
	}
) => {

	//setPosMax((pos > posMax) ? pos : posMax);
	//setPos(randomDecimal);

	useEffect(() => {

		if (!record) {
			//runDummy.stop();
			//dispatch(updateROM({ key: "extension", value: randomDecimal }));
			//dispatch(updateROM({ key: "startRecording", value: record }))
		} else {
			//runDummy.start();
			//dispatch(updateROM({ key: "startRecording", value: record }))
		}

		//return () => runDummy.stop();
	}, [record, pos]);

	return randomDecimal;
}

export default useGetExtension
