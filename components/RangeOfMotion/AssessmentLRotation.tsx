import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { View, Text } from "react-native";
import { type ChildROMRef } from "../../model/ChildRefGetValue";
import { bleEventEmitter } from "../../utils/BleEmitter";

type AssessmentCardProps = {
	record: boolean;
};

const AssessmentLRotation = forwardRef<ChildROMRef, AssessmentCardProps>(({ record }, ref) => {
	const [pos, setPos] = useState<number>(0.0)
	const [posMax, setPosMax] = useState<number>(0.0)
	const rotationOffset = useRef<number | null>(null);

	useEffect(() => {
		
		const sub = bleEventEmitter.addListener('BleDataYaw', (data: number) => {
			if (rotationOffset.current === null) {
				// assign ONCE the first time listener is called
				rotationOffset.current = Math.round(data);
			}

			let alpha: number = Math.round(data) - rotationOffset.current;
			alpha = normalizeAngle(alpha);
			setPos(Math.round((alpha <= 0 ? -alpha : 0) * 10) / 10);
			setPosMax((pos > posMax) ? pos : posMax);
		});

		return () => {
			sub.remove();
		};
	}, [pos]);

	useImperativeHandle(ref, () => ({
		getValue: () => {
			return posMax;
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