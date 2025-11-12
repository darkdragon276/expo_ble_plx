import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { type LiveHeadPositionProps } from '../../model/JointPosition';

const CIRCLE_RADIUS = 85;
const CURSOR_RADIUS = 10;

const Cursor = ({ dataRef, reset, record }: { dataRef: React.RefObject<LiveHeadPositionProps | null>, reset: React.RefObject<boolean>, record: boolean }) => {
	const animatedPos = useState(new Animated.ValueXY({ x: 0, y: 0 }))[0];

	// dummy position
	useEffect(() => {

		const reStart = () => {
			setTimeout(() => {
				reset.current = false;
			}, 1000);
		}

		const interval = setInterval(() => {
			const t = Date.now() / 1000;
			let x = 100 * Math.cos(t);
			let y = 120 * Math.sin(t * 1.5);
			if (reset.current) {
				reStart();
				x = 0;
				y = 0;
			}
			updateCursorPosition(x, y);
		}, 50);

		return () => clearInterval(interval);
	}, []);

	// limits within a circle
	const updateCursorPosition = (x: number, y: number) => {
		const distance = Math.sqrt(x * x + y * y);

		let newX = x;
		let newY = y;

		// if out of circle then scale again
		if (distance > CIRCLE_RADIUS - CURSOR_RADIUS) {
			const ratio = (CIRCLE_RADIUS - CURSOR_RADIUS) / distance;
			newX = x * ratio;
			newY = y * ratio;
		}

		// update position
		Animated.spring(animatedPos, {
			toValue: { x: newX, y: newY },
			useNativeDriver: false,
			speed: 8,
		}).start();

		dataRef.current = {
			horizontal: x,
			vertical: y,
			current: "Right Extension"
		};
	};

	return (
		<View>
			<Animated.View
				style={[
					styles.cursor,
					{
						transform: [
							{ translateX: animatedPos.x },
							{ translateY: animatedPos.y },
						],
					},
				]}
			>
				<View style={!record ? styles.plusVertical : styles.plusRecordVertical} />
				<View style={!record ? styles.plusHorizontal : styles.plusRecordHorizontal} />
			</Animated.View>
		</View>
	)
}

export default Cursor

const styles = StyleSheet.create({
	cursor: {
		position: 'absolute',
		width: CURSOR_RADIUS * 2,
		height: CURSOR_RADIUS * 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	plusVertical: {
		position: 'absolute',
		width: 3,
		height: 20,
		backgroundColor: '#155dfc',
	},
	plusHorizontal: {
		position: 'absolute',
		height: 3,
		width: 20,
		backgroundColor: '#155dfc',
	},
	plusRecordVertical: {
		position: 'absolute',
		width: 3,
		height: 20,
		backgroundColor: '#fb2c26',
	},
	plusRecordHorizontal: {
		position: 'absolute',
		height: 3,
		width: 20,
		backgroundColor: '#fb2c26',
	},
});