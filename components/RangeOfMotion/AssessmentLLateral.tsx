import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { View, Text } from "react-native";
import { ChildROMRef } from "../../model/ChildRefGetValue";
import { bleEventEmitter } from "../../utils/BleEmitter";

let l_lateral: number = 0.0;
type AssessmentCardProps = {
	record: boolean;
};

const AssessmentLLateral = forwardRef<ChildROMRef, AssessmentCardProps>(({ record }, ref) => {
	const [pos, setPos] = useState<number>(0.0)
	const [posMax, setPosMax] = useState<number>(0.0)

	useEffect(() => {
		const sub = bleEventEmitter.addListener('BleDataRoll', (data: number) => {
			l_lateral = Math.round(data * 10) / 10;
			if (l_lateral < 0) {
				setPos(l_lateral * -1);
			} else {
				setPos(0.0);
			}
			setPosMax((pos > posMax) ? pos : posMax);
		});

		return () => {
			l_lateral = 0.0;
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
			<View className="flex-row items-center justify-between mb-2">
				<Text className="text-3xl font-bold text-teal-600 leading-none">{pos}°</Text>
				<Text className="text-md text-gray-400">Max: {posMax}°</Text>
			</View>

			{/* Progress bar */}
			<View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
				<View style={{ width: `${pos}%` }} className="h-1.5 rounded-full transition-all duration-300 bg-teal-400" />
			</View>
		</>
	);
});

export default AssessmentLLateral