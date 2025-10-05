import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { View, Text } from "react-native";
import { type ChildROMRef } from "../../model/ChildRefGetValue";
import { bleEventEmitter } from "../../utils/BleEmitter";

type AssessmentCardProps = {
	record: boolean;
};

const AssessmentRLateral = forwardRef<ChildROMRef, AssessmentCardProps>(({ record }, ref) => {
	const [pos, setPos] = useState<number>(0.0)
	const [posMax, setPosMax] = useState<number>(0.0)

	//console.log(`AssessmentRLateral run!`)

	useEffect(() => {
		//console.log(`AssessmentCardExtension useEffect running!`)
		const sub = bleEventEmitter.addListener('BleDataRoll', (data) => {
			//console.log(data);
			if (data > 0) {
				setPos(data);
			} else {
				setPos(0.0);
			}
			setPosMax((data > posMax) ? data : posMax);
		});

		return () => {
			sub.remove();
		};
	}, [pos]);

	useImperativeHandle(ref, () => ({
		getValue: () => {
			//console.log(`AssessmentRLateral useImperativeHandle return: ${parseFloat(pos.toFixed(1))}`)
			return parseFloat(pos.toFixed(1))
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