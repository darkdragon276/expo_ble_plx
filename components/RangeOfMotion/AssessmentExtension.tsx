import { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import useGetExtension from "../../hooks/rangeOfMotionHook/useGetExtension";

const AssessmentCardExtension = ({ record }: { record: boolean }) => {
	const [pos, setPos] = useState<number>(0.0)
	const [posMax, setPosMax] = useState<number>(0.0)

	//console.log(`AssessmentCardExtension run!`)

	useGetExtension({ record, pos, setPos, posMax, setPosMax });

	useEffect(() => {
		//return () => { }
	}, [record, pos, posMax])

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
};

export default AssessmentCardExtension
