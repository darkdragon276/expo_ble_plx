import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { View, Text } from "react-native";
import { type ChildROMRef } from "../../model/ChildRefGetValue";
import { bleEventEmitter } from "../../utils/BleEmitter";

let extension: number = 0.0;
type AssessmentCardProps = {
	record: boolean;
};

const AssessmentExtension = forwardRef<ChildROMRef, AssessmentCardProps>(({ record }, ref) => {
	const [pos, setPos] = useState<number>(0.0)
	const [posMax, setPosMax] = useState<number>(0.0)

	useEffect(() => {
		const sub = bleEventEmitter.addListener('BleDataPitch', (data: number) => {
			extension = parseFloat(data.toFixed(1));
			if (extension > 0) {
				setPos(extension);
			} else {
				setPos(0.0);
			}
			setPosMax((pos > posMax) ? pos : posMax);
		});

		return () => {
			extension = 0.0;
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
				<Text className="text-3xl font-bold text-blue-600 leading-none">{pos}°</Text>
				<Text className="text-md text-gray-400">Max: {posMax}°</Text>
			</View>

			{/* Progress bar */}
			<View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
				<View style={{ width: `${(pos * posMax) / 100}%` }} className="h-1.5 rounded-full transition-all duration-300 bg-blue-400" />
			</View>
		</>
	);
});

export default AssessmentExtension
