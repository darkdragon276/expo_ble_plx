import { forwardRef, useImperativeHandle, useState } from "react";
import { View, Text } from "react-native";
import useGetLLateral from "../../hooks/rangeOfMotionHook/useGetLLateral";
import { ChildROMRef } from "../../model/ChildRefGetValue";

let l_lateral = 0.0;
type AssessmentCardProps = {
	record: boolean;
};

const AssessmentLLateral = forwardRef<ChildROMRef, AssessmentCardProps>(({ record }, ref) => {
	const [pos, setPos] = useState<number>(0.0)
	const [posMax, setPosMax] = useState<number>(0.0)

	//console.log(`AssessmentLLateral run!`)

	l_lateral = useGetLLateral({ record, pos, setPos, posMax, setPosMax });

	useImperativeHandle(ref, () => ({
		getValue: () => {
			//console.log(`AssessmentLLateral useImperativeHandle running!`)
			return l_lateral
		},
	}), [record]);

	return (
		<>
			<View className="flex-row items-center justify-between mb-2">
				<Text className="text-3xl font-bold text-teal-600 leading-none">{pos.toFixed(1)}°</Text>
				<Text className="text-md text-gray-400">Max: {posMax.toFixed(1)}°</Text>
			</View>

			{/* Progress bar */}
			<View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
				<View style={{ width: `${pos}%` }} className="h-1.5 rounded-full transition-all duration-300 bg-teal-400" />
			</View>
		</>
	);
});

export default AssessmentLLateral