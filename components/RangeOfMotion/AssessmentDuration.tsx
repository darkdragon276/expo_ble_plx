import { Text, View } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ChildROMRef } from '../../model/ChildRefGetValue';

type AssessmentCardProps = {
	record: boolean;
	mode: string
};

const AssessmentDuration = forwardRef<ChildROMRef, AssessmentCardProps>(({ record, mode }, ref) => {
	const secondsRef = useRef(1);
	const [timer, setTimer] = useState<string>("0:01")
	const [seconds, setSeconds] = useState<number>(1)
	let interval: ReturnType<typeof setInterval>;

	useEffect(() => {
		const start = () => {
			if (interval) return;

			interval = setInterval(() => {
				setSeconds(prev => {
					const nextSeconds = prev + 1;
					secondsRef.current = nextSeconds;
					setTimer(formatTime(nextSeconds));
					return nextSeconds;
				})
			}, 1000);
		}

		const stop = () => {
			clearInterval(interval);
		}

		const formatTime = (seconds: number): string => {
			const minutes = Math.floor(seconds / 60);
			const secs = seconds % 60;
			return `${minutes}:${secs.toString().padStart(2, '0')}`;
		}

		if (record) {
			start();
		} else {
			stop();
		}

		return () => {
			clearInterval(interval);
		}

	}, [record])

	useImperativeHandle(ref, () => ({
		getValue: () => {
			return secondsRef.current;
		},
	}), [record]);

	return (
		<View>
			{
				mode == "ROM"
					?
					<Text className="text-white font-semibold">({timer})</Text>
					:
					<Text className="text-green-800 font-semibold">{timer}</Text>
			}
		</View>
	)
});

export default AssessmentDuration