import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { View, Text } from "react-native";
import { type ChildROMRef } from "../../model/ChildRefGetValue";
import { bleEventEmitter } from "../../utils/BleEmitter";

let l_rotation: number = 0.0;
let rotationOffset: number = 0.0
let alpha: number = 0.0;
type AssessmentCardProps = {
	record: boolean;
};

const AssessmentLRotation = forwardRef<ChildROMRef, AssessmentCardProps>(({ record }, ref) => {
	const [pos, setPos] = useState<number>(0.0)
	const [posMax, setPosMax] = useState<number>(0.0)

	useEffect(() => {
		const sub = bleEventEmitter.addListener('BleDataYaw', (data: number) => {

			l_rotation = parseFloat(data.toFixed(1));

			if (rotationOffset == 0.0) {
				rotationOffset = l_rotation
			}

			alpha = l_rotation - rotationOffset
			alpha = normalizeAngle(alpha);

			setPos(alpha < 0 ? alpha * -1 : alpha);
			setPosMax((pos > posMax) ? pos : posMax);
		});

		return () => {
			l_rotation = 0.0;
			rotationOffset = 0.0;
			alpha = 0.0;
			sub.remove();
		};
	}, [pos]);

	useImperativeHandle(ref, () => ({
		getValue: () => {
			return posMax
		},
	}), [record]);

	const normalizeAngle = (alpha: number): number => {
		alpha = ((alpha + 180) % 360 + 360) % 360;
		return alpha - 180;
	};

	return (
		<>
			<View className="flex-row items-center justify-between mb-2">
				<Text className="text-3xl font-bold text-purple-600 leading-none">{pos}°</Text>
				<Text className="text-md text-gray-400">Max: {posMax}°</Text>
			</View>

			{/* Progress bar */}
			<View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
				<View style={{ width: `${pos}%` }} className="h-1.5 rounded-full transition-all duration-300 bg-purple-400" />
			</View>
		</>
	);
});

export default AssessmentLRotation