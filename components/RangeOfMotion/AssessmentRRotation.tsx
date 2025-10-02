import { forwardRef, useImperativeHandle, useState } from "react";
import { View, Text, Image } from "react-native";
import useGetRRotation from "../../hooks/rangeOfMotionHook/useGetRRotation";
import { type ChildROMRef } from "../../model/ChildRefGetValue";

let r_rotation = 0.0;
type AssessmentCardProps = {
	record: boolean;
};

const AssessmentRRotation = forwardRef<ChildROMRef, AssessmentCardProps>(({ record }, ref) => {
	const [pos, setPos] = useState<number>(0.0)
	const [posMax, setPosMax] = useState<number>(0.0)

	//console.log(`AssessmentRRotation run!`)

	r_rotation = useGetRRotation({ record, pos, setPos, posMax, setPosMax });

	useImperativeHandle(ref, () => ({
		getValue: () => {
			//console.log(`AssessmentRRotation useImperativeHandle running!`)
			return r_rotation
		},
	}), [record]);

	return (
		<>
			<View className="flex-row items-center justify-between mb-2">
				<Text className="text-3xl font-bold text-orange-600 leading-none">{pos.toFixed(1)}°</Text>
				<Text className="text-md text-gray-400">Max: {posMax.toFixed(1)}°</Text>
			</View>

			{/* Progress bar */}
			<View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
				<View style={{ width: `${pos}%` }} className="h-1.5 rounded-full transition-all duration-300 bg-orange-400" />
			</View>
		</>
	);
})

export default AssessmentRRotation