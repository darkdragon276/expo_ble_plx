import { styled } from "nativewind";
import { View, Text, Alert } from "react-native";
import { CircleCheckBig } from "lucide-react-native";
import CalibrationSpinning from "../CalibrationSpinning";
import { dv_cn } from "../../../dummy/calibrationStepData";

//redux zone st
import useRunCnDvStep from '../../../hooks/calibrationHook/useRunCnDvStep';
import useCheckStep from '../../../hooks/calibrationHook/useCheckStep';
import useStepColor from '../../../hooks/calibrationHook/useStepColor';
import { useDispatch } from "react-redux";
import { updateStep } from "../../../store/redux/calibrationStepSlice";
import { bleEventEmitter } from "../../../utils/BleEmitter";
import { useEffect, useState } from "react";
import { BLEService } from "../../../ble/BLEService";
import { KrossDevice } from "../../../ble/KrossDevice";
//redux zone ed

const LuCircleBig = styled(CircleCheckBig);
let data = dv_cn
let IconDefault: React.FC<any> = data.Icon

const DeviceConnectionStep = ({ connectDeviceStep }: { connectDeviceStep: string }) => {
	//const DeviceConnectionStep = () => {

	//const { stt_cn_dv_stt } = useCheckStep();
	const status = connectDeviceStep
	const { statusColor, textColor } = useStepColor({ status });
	const krossDevice = new KrossDevice();
	//const [connectStep, setConnectStep] = useState(false);

	//console.log(`DeviceConnectionStep ${stt_cn_dv_stt}`);

	// useRunCnDvStep();

	// useEffect(() => {

	// 	if (BLEService.getDevice() == null) {
	// 		BLEService.scanDevices((device) => {
	// 			BLEService.connectToDevice(device.id);
	// 		}, [BLEService.SERVICE_UUID]);
	// 	} else {
	// 		BLEService.connectToDevice(BLEService.getDevice()!.id);
	// 	}

	// 	runStartCalibation();
	// }, [])

	const runStartCalibation = async () => {
		if (BLEService.getDevice() == null) {
			Alert.alert('Connect error', `No connected device: `);
			return;
		}

		try {
			console.log('DeviceConnectionStep is pack --- MAGNET_CALIB_START');
			await BLEService.discoverAllServicesAndCharacteristicsForDevice();
			BLEService.writeCharacteristicWithoutResponseForDevice(
				BLEService.SERVICE_UUID,
				BLEService.DATA_IN_UUID,
				KrossDevice.encodeBase64(krossDevice.pack(KrossDevice.Cmd.MAGNET_CALIB_START))
			);

		} catch (e: any) {
			//Alert.alert('connect error', e?.message ?? String(e));
		}
	};

	// const dispatch = useDispatch();

	// useEffect(() => {
	// 	dispatch(updateStep({ key: "cn_dv_stt", value: "active" }))

	// 	const sub = bleEventEmitter.addListener('CALIBRATION_CONNECT_DEVICE', (data) => {
	// 		if (data) {
	// 			//dispatch(updateStep({ key: "cn_dv_stt", value: "done" }))
	// 			//dispatch(updateStep({ key: "ss_init", value: "active" }))
	// 			//setConnectStep(true)
	// 		}
	// 	});

	// 	//console.log(`DeviceConnectionStep ${stt_cn_dv_stt} - ${stt_ss_init}`)

	// 	return () => {
	// 		//console.log(`DeviceConnectionStep sub removed`);
	// 		//sub.remove();
	// 	};
	// }, []);

	return (
		<View className={`flex-row items-center p-3 my-2 rounded-xl ${statusColor}`}>
			<View className="mr-2">
				{status === "done" ? <LuCircleBig size={20} color="green"></LuCircleBig> : status === "active" ? <CalibrationSpinning /> : <IconDefault />}
			</View>
			<View>
				<Text className={`font-bold text-base ${textColor}`}>{data.label}</Text>
				<Text className={`text-sm ${textColor}`}>{data.description}</Text>
			</View>
		</View>
	);
}

export default DeviceConnectionStep