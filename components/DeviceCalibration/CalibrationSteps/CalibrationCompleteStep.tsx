import { styled } from "nativewind";
import { View, Text, Alert } from "react-native";
import { CircleCheckBig } from "lucide-react-native";
import CalibrationSpinning from "../CalibrationSpinning";
import React, { useEffect } from "react";
import { c_cpl } from "../../../dummy/calibrationStepData";

//redux zone st
import useRunCompleteStep from '../../../hooks/calibrationHook/useRunCompleteStep';
import useCheckStep from '../../../hooks/calibrationHook/useCheckStep';
import useStepColor from '../../../hooks/calibrationHook/useStepColor';
import { BLEService } from "../../../ble/BLEService";
import { KrossDevice } from "../../../ble/KrossDevice";
import { Characteristic } from "react-native-ble-plx";
//redux zone ed

const LuCircleBig = styled(CircleCheckBig);
let data = c_cpl
let IconDefault: React.FC<any> = data.Icon

const CalibrationCompleteStep = ({ complete }: { complete: string }) => {
	//const { stt_c_cpl } = useCheckStep();
	const status = complete
	const { statusColor, textColor } = useStepColor({ status });
	const krossDevice = new KrossDevice();

	//useRunCompleteStep();

	useEffect(() => {

		// if (BLEService.getDevice() == null) {
		// 	BLEService.scanDevices((device) => {
		// 		BLEService.connectToDevice(device.id);
		// 	}, [BLEService.SERVICE_UUID]);
		// } else {
		// 	BLEService.connectToDevice(BLEService.getDevice()!.id);
		// }

		if (status === 'active') {
			runEndCalibation();
		}

		return () => {
			BLEService.disconnectDevice();
		}
	}, [status])

	const runEndCalibation = async () => {
		if (BLEService.getDevice() == null) {
			Alert.alert('Connect error', `No connected device: `);
			return;
		}

		try {
			console.log('CalibrationCompleteStep is pack --- MAGNET_CALIB_STOP');
			await BLEService.discoverAllServicesAndCharacteristicsForDevice();
			BLEService.writeCharacteristicWithoutResponseForDevice(
				BLEService.SERVICE_UUID,
				BLEService.DATA_IN_UUID,
				KrossDevice.encodeBase64(krossDevice.pack(KrossDevice.Cmd.MAGNET_CALIB_STOP))
			);
		} catch (e: any) {
			//Alert.alert('connect error', e?.message ?? String(e));
		}
	};

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

export default CalibrationCompleteStep
