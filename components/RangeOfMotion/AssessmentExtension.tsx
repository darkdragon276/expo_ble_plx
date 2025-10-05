import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { View, Text } from "react-native";
import { type ChildROMRef } from "../../model/ChildRefGetValue";
import { bleEventEmitter, type BleEmitterProps} from "../../utils/BleEmitter";

type AssessmentCardProps = {
	record: boolean;
};

const AssessmentExtension = forwardRef<ChildROMRef, AssessmentCardProps>(({ record }, ref) => {
	const [pos, setPos] = useState<number>(0.0)
	const [posMax, setPosMax] = useState<number>(0.0)

	//console.log(`AssessmentCardExtension render!`)

	useEffect(() => {
		//console.log(`AssessmentCardExtension useEffect running!`)
		const sub = bleEventEmitter.addListener('BleDataPitch', (data) => {
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
			//console.log(`AssessmentExtension useImperativeHandle running! ${parseFloat(pos.toFixed(1))}`)
			return parseFloat(pos.toFixed(1))
		},
	}), [record]);

	return (
		<>
			<View className="flex-row items-center justify-between mb-2">
				<Text className="text-3xl font-bold text-blue-600 leading-none">{pos.toFixed(1)}°</Text>
				<Text className="text-md text-gray-400">Max: {posMax.toFixed(1)}°</Text>
			</View>

			{/* Progress bar */}
			<View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
				<View style={{ width: `${(pos * posMax) / 100}%` }} className="h-1.5 rounded-full transition-all duration-300 bg-blue-400" />
			</View>
		</>
	);
});

export default AssessmentExtension
