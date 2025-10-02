import { useState, forwardRef, useImperativeHandle } from "react";
import { View, Text } from "react-native";
import useGetExtension from "../../hooks/rangeOfMotionHook/useGetExtension";
import { type ChildROMRef } from "../../model/ChildRefGetValue";

let extension = 0.0;
type AssessmentCardProps = {
	record: boolean;
};

const AssessmentExtension = forwardRef<ChildROMRef, AssessmentCardProps>(({ record }, ref) => {
	const [pos, setPos] = useState<number>(0.0)
	const [posMax, setPosMax] = useState<number>(0.0)

	//console.log(`AssessmentCardExtension run!`)

	extension = useGetExtension({ record, pos, setPos, posMax, setPosMax });

	useImperativeHandle(ref, () => ({
		getValue: () => {
			//console.log(`AssessmentExtension useImperativeHandle running!`)
			return extension
		},
	}), [record]);

	return (
		<>
			<View className="flex-row items-center justify-between mb-2">
				<Text className="text-3xl font-bold text-blue-600 leading-none">{pos.toFixed(1)}°</Text>
				<Text className="text-md text-gray-400">Max: {posMax.toFixed(1)}°</Text>
			</View>

			{/* Progress bar */}
			<View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
				<View style={{ width: `${(pos * posMax) / 100}%` }} className="h-1.5 rounded-full transition-all duration-300 bg-blue-400" />
			</View>
		</>
	);
});

export default AssessmentExtension
