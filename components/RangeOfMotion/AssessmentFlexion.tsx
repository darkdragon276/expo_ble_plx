import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { View, Text } from "react-native";
import { type ChildROMRef } from "../../model/ChildRefGetValue";
import { bleEventEmitter } from "../../utils/BleEmitter";

let flexion: number = 0.0;
type AssessmentCardProps = {
	record: boolean;
};

const AssessmentFlexion = forwardRef<ChildROMRef, AssessmentCardProps>(({ record }, ref) => {
	const [pos, setPos] = useState<number>(0.0)
	const [posMax, setPosMax] = useState<number>(0.0)

	useEffect(() => {
		const sub = bleEventEmitter.addListener('BleDataPitch', (data: number) => {
			flexion = Math.round(data * 10) / 10;
			if (flexion < 0) {
				setPos(flexion * -1);
			} else {
				setPos(0.0);
			}
			setPosMax((pos > posMax) ? pos : posMax);
		});

		return () => {
			flexion = 0.0;
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
				<Text className="text-3xl font-bold text-green-600 leading-none">{pos}°</Text>
				<Text className="text-md text-gray-400">Max: {posMax}°</Text>
			</View>

			{/* Progress bar */}
			<View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
				<View style={{ width: `${pos}%` }} className="h-1.5 rounded-full transition-all duration-300 bg-green-400" />
			</View>
		</>
	);
});

export default AssessmentFlexion