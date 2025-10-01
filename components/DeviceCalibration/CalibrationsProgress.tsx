import CalibrationsProgressStep from '../DeviceCalibration/CalibrationsProgressStep'
import CalibrationsDone from './CalibrationsDone'
import HoldDeviceStep from './CalibrationSteps/HoldDeviceStep'
import SensorInitializationStep from './CalibrationSteps/SensorInitializationStep'
import XAxisStep from './CalibrationSteps/XAxisStep'
import YAxisStep from './CalibrationSteps/YAxisStep'
import ZAxisStep from './CalibrationSteps/ZAxisStep'
import DeviceConnectionStep from "./CalibrationSteps/DeviceConnectionStep";
import CalibrationCompleteStep from "./CalibrationSteps/CalibrationCompleteStep";
import useCheckStep from "../../hooks/calibrationHook/useCheckStep";

const CalibrationsProgress = () => {
	const { stt_c_cpl } = useCheckStep();

	return (
		<>
			{stt_c_cpl === "done"
				?
				(<CalibrationsDone></CalibrationsDone>)
				:
				(
					<>
						<DeviceConnectionStep></DeviceConnectionStep>
						<SensorInitializationStep></SensorInitializationStep>
						<HoldDeviceStep ></HoldDeviceStep>
						<XAxisStep></XAxisStep>
						<YAxisStep></YAxisStep>
						<ZAxisStep></ZAxisStep>
						<CalibrationCompleteStep></CalibrationCompleteStep>
					</>
				)
			}
		</>
	)
}

export default CalibrationsProgress