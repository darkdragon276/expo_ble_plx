import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { View, Text } from "react-native";
import { type ChildROMRef } from "../../model/ChildRefGetValue";
import { bleEventEmitter } from "../../utils/BleEmitter";

let r_lateral: number = 0.0;
type AssessmentCardProps = {
	record: boolean;
};

const AssessmentRLateral = forwardRef<ChildROMRef, AssessmentCardProps>(({ record }, ref) => {
	const [pos, setPos] = useState<number>(0.0)
	const [posMax, setPosMax] = useState<number>(0.0)

	useEffect(() => {
		const sub = bleEventEmitter.addListener('BleDataRoll', (data: number) => {
			r_lateral = Math.round(data * 10) / 10;

			if (r_lateral > 0) {
				setPos(r_lateral);
			} else {
				setPos(0.0);
			}
			setPosMax((pos > posMax) ? pos : posMax);
		});

		return () => {
			sub.remove();
		};
	}, [pos]);

	useImperativeHandle(ref, () => ({
		getValue: () => {
			return posMax
		},
	}), [record]);

	return (
		<>
			{/* Value + Max */}
			<View className="flex-row items-center justify-between mb-2">
				<Text className="text-3xl font-bold text-pink-600 leading-none">{pos}°</Text>
				<Text className="text-md text-gray-400">Max: {posMax}°</Text>
			</View>

			{/* Progress bar */}
			<View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
				<View style={{ width: `${pos}%` }} className="h-1.5 rounded-full transition-all duration-300 bg-pink-400" />
			</View>
		</>
	);
});

export default AssessmentRLateral