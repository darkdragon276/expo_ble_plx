import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { View, Text } from "react-native";
import { type ChildROMRef } from "../../model/ChildRefGetValue";
import { bleEventEmitter } from "../../utils/BleEmitter";

type AssessmentCardProps = {
	record: boolean;
};

let firstLRotationOffset: number = 0.0

const AssessmentLRotation = forwardRef<ChildROMRef, AssessmentCardProps>(({ record }, ref) => {
	const [pos, setPos] = useState<number>(0.0)
	const [posMax, setPosMax] = useState<number>(0.0)

	//console.log(`AssessmentLRotation run!`)

	useEffect(() => {
		//console.log(`AssessmentCardExtension useEffect running!`)
		const sub = bleEventEmitter.addListener('BleDataYaw', (data) => {
			//console.log(data);

			if (data < 0) {
				data = (data * -1);
				data = data - firstLRotationOffset;
				setPos(data);
				setPosMax((pos > posMax) ? pos : posMax);

				if (firstLRotationOffset == 0.0) {
					firstLRotationOffset = data
				}

			} else {
				setPos(0.0);
			}
		});

		return () => {
			sub.remove();
		};
	}, [pos]);

	useImperativeHandle(ref, () => ({
		getValue: () => {
			//console.log(`AssessmentLRotation useImperativeHandle return: ${parseFloat(pos.toFixed(1))}`)
			return parseFloat(pos.toFixed(1))
		},
	}), [record]);

	return (
		<>
			<View className="flex-row items-center justify-between mb-2">
				<Text className="text-3xl font-bold text-purple-600 leading-none">{pos.toFixed(1)}°</Text>
				<Text className="text-md text-gray-400">Max: {posMax.toFixed(1)}°</Text>
			</View>

			{/* Progress bar */}
			<View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
				<View style={{ width: `${pos}%` }} className="h-1.5 rounded-full transition-all duration-300 bg-purple-400" />
			</View>
		</>
	);
});

export default AssessmentLRotation