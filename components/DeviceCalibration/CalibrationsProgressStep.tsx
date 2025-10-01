import { styled } from "nativewind";
import { View, Text } from "react-native";
import type { StepProps } from '../../model/CalibrationStepProps';
import { CircleCheckBig } from "lucide-react-native";
import CalibrationSpinning from "./CalibrationSpinning";

const LuCircleBig = styled(CircleCheckBig);

const CalibrationsProgressStep = ({ label, description, status, Icon, IconLoading }: StepProps) => {

	let statusColor =
		status === "done"
			? "bg-green-100 border-green-500"
			: status === "active"
				? "bg-blue-100 border-blue-500"
				: "bg-gray-100 border-gray-300";

	let textColor =
		status === "done"
			? "text-green-700"
			: status === "active"
				? "text-blue-700"
				: "text-gray-600";

	return (
		<View className={`flex-row items-center p-3 my-2 rounded-xl ${statusColor}`}>
			<View className="mr-2">
				{status === "done" ? <LuCircleBig size={20} color="green"></LuCircleBig> : status === "active" ? <CalibrationSpinning /> : Icon()}
			</View>
			<View>
				<Text className={`font-bold text-base ${textColor}`}>{label}</Text>
				<Text className={`text-sm ${textColor}`}>{description}</Text>
			</View>
		</View>
	);
};

export default CalibrationsProgressStep