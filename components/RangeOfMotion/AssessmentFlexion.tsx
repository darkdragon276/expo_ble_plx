import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { View, Text } from "react-native";
import useGetFlexion from "../../hooks/rangeOfMotionHook/useGetFlexion";
import { type ChildROMRef } from "../../model/ChildRefGetValue";
import { bleEventEmitter } from "../../utils/BleEmitter";

type AssessmentCardProps = {
	record: boolean;
};

const AssessmentFlexion = forwardRef<ChildROMRef, AssessmentCardProps>(({ record }, ref) => {
	const [pos, setPos] = useState<number>(0.0)
	const [posMax, setPosMax] = useState<number>(0.0)

	//console.log(`AssessmentFlexion run!`)

	//flexion = useGetFlexion({ record, pos, setPos, posMax, setPosMax });

	useEffect(() => {
		//console.log(`AssessmentCardExtension useEffect running!`)
		const sub = bleEventEmitter.addListener('BleDataPitch', (data) => {
			//console.log(data);
			if (data < 0) {
				setPos(data * -1);
				setPosMax((pos > posMax) ? pos : posMax);
			}
		});

		return () => {
			sub.remove();
		};
	}, [pos]);

	useImperativeHandle(ref, () => ({
		getValue: () => {
			console.log(`AssessmentFlexion useImperativeHandle return: ${pos}`)
			return pos
		},
	}), [record]);

	return (
		<>
			<View className="flex-row items-center justify-between mb-2">
				<Text className="text-3xl font-bold text-green-600 leading-none">{pos.toFixed(1)}°</Text>
				<Text className="text-md text-gray-400">Max: {posMax.toFixed(1)}°</Text>
			</View>

			{/* Progress bar */}
			<View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
				<View style={{ width: `${pos}%` }} className="h-1.5 rounded-full transition-all duration-300 bg-green-400" />
			</View>
		</>
	);
});

export default AssessmentFlexion