import { styled } from "nativewind";
import type { StepProps } from '../model/CalibrationStepProps';
import CalibrationSpinning from "../components/DeviceCalibration/CalibrationSpinning";
import { CircleCheckBig, Hand, RotateCcw, RotateCw, ArrowUpDown, BluetoothSearching } from "lucide-react-native";

const LuBleSearch = styled(BluetoothSearching);
const LuCircleBig = styled(CircleCheckBig);
const LuHand = styled(Hand);
const LuRotateCcw = styled(RotateCcw);
const LuRotateCw = styled(RotateCw);
const LuArrowUpDown = styled(ArrowUpDown);

export const dv_cn: Omit<StepProps, "status"> =
{
	label: "Device Connection",
	description: "Verifying connection to HeadX Kross Smart device",
	IconLoading: () => <CalibrationSpinning />,
	Icon: () => <LuBleSearch size={20} color="gray"></LuBleSearch>,
};

export const ss_init: Omit<StepProps, "status"> =
{
	label: "Sensor Initialization",
	description: "Initializing motion sensors and gyroscopes",
	IconLoading: () => <CalibrationSpinning />,
	Icon: () => <LuCircleBig size={20} color="gray"></LuCircleBig>,
};

export const hold_dv: Omit<StepProps, "status"> =
{
	label: "Hold Device Steady",
	description: "Hold device steady with the power button facing upward",
	IconLoading: () => <CalibrationSpinning />,
	Icon: () => <LuHand size={20} color="gray"></LuHand>,
};

export const x_asis: Omit<StepProps, "status"> =
{
	label: "X-Axis Calibration",
	description: "Pitch Calibration - Rotate the device 360 degrees up or down",
	IconLoading: () => <CalibrationSpinning />,
	Icon: () => <LuRotateCw size={20} color="gray"></LuRotateCw>,
};

export const y_asis: Omit<StepProps, "status"> =
{
	label: "Y-Axis Calibration",
	description: "Roll Calibration - Rotate the device 360 degrees clockwise or counter clockwise",
	IconLoading: () => <CalibrationSpinning />,
	Icon: () => <LuArrowUpDown size={20} color="gray"></LuArrowUpDown>,
};

export const z_asis: Omit<StepProps, "status"> =
{
	label: "Z-Axis Calibration",
	description: "Yaw Calibration - Rotate the device 360 degrees left or right",
	IconLoading: () => <CalibrationSpinning />,
	Icon: () => <LuRotateCcw size={20} color="gray"></LuRotateCcw>,
}

export const c_cpl: Omit<StepProps, "status"> =
{
	label: "Calibration Complete",
	description: "All axes calibrated - device ready for assessment",
	IconLoading: () => <CalibrationSpinning />,
	Icon: () => <LuCircleBig size={20} color="gray"></LuCircleBig>,
};