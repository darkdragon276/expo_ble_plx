import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MarkerCursor from './MarkerCursor'
import { MakerCursorProps } from '../../model/JointPosition'

type MakerCursorChildProps = {
	mode: string;
	data: MakerCursorProps[] | null;
	getData: () => MakerCursorProps | undefined;
	subscribe: (callback: () => void) => void;
};

const MakerCursorList: React.FC<MakerCursorChildProps> = ({ mode, data, getData, subscribe }) => {

	const [items, setItems] = useState<MakerCursorProps[]>([]);

	//console.log(items)

	useEffect(() => {
		//console.log(mode)
		if (mode == "LIVE") {
			subscribe(() => {
				const newMaker = getData();
				if (!newMaker)
					return;

				setItems(prevList => [...prevList, newMaker]);
			});

		} else {
			//console.log(mode)
			setItems(data ?? []);
		}

		//console.log(items)

	}, [mode, data, getData, subscribe]);

	return (
		<View>
			{
				items && items.length > 0
					?
					items.map((item, index) => (
						<MarkerCursor key={index} id={item.id} x={item.x} y={item.y}></MarkerCursor>
					))
					:
					<View></View>
			}
		</View>
	)
}

export default MakerCursorList

const styles = StyleSheet.create({})