import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { View, Text } from "react-native";
import useGetRLateral from "../../hooks/rangeOfMotionHook/useGetRLateral";
import { type ChildROMRef } from "../../model/ChildRefGetValue";
import { bleEventEmitter } from "../../utils/BleEmitter";

type AssessmentCardProps = {
	record: boolean;
};

const AssessmentRLateral = forwardRef<ChildROMRef, AssessmentCardProps>(({ record }, ref) => {
	const [pos, setPos] = useState<number>(0.0)
	const [posMax, setPosMax] = useState<number>(0.0)

	//console.log(`AssessmentRLateral run!`)

	//r_lateral = useGetRLateral({ record, pos, setPos, posMax, setPosMax });

	useEffect(() => {
		//console.log(`AssessmentCardExtension useEffect running!`)
		const sub = bleEventEmitter.addListener('BleDataRoll', (data) => {
			//console.log(data);
			setPos(data);
			setPosMax((pos > posMax) ? pos : posMax);
		});

		return () => {
			sub.remove();
		};
	}, [pos]);

	useImperativeHandle(ref, () => ({
		getValue: () => {
			console.log(`AssessmentRLateral useImperativeHandle return: ${pos}`)
			return pos
		},
	}), [record]);

	return (
		<>
			{/* Value + Max */}
			<View className="flex-row items-center justify-between mb-2">
				<Text className="text-3xl font-bold text-pink-600 leading-none">{pos.toFixed(1)}°</Text>
				<Text className="text-md text-gray-400">Max: {posMax.toFixed(1)}°</Text>
			</View>

			{/* Progress bar */}
			<View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
				<View style={{ width: `${pos}%` }} className="h-1.5 rounded-full transition-all duration-300 bg-pink-400" />
			</View>
		</>
	);
});

export default AssessmentRLateral