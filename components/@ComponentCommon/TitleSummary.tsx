import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styled } from 'nativewind';
import { LucideCheck, LucideX, PenLine } from 'lucide-react-native';

const LuPenLine = styled(PenLine);
const LuCheck = styled(LucideCheck);
const LuUnCheck = styled(LucideX);

const TitleSummary = ({ title, callback }: { title: string, callback: (text: string) => Promise<boolean> }) => {
	const [text, setText] = useState(title)
	const [oldtext, setOldText] = useState(title)
	const [edit, setEditText] = useState(false)

	useEffect(() => {
		setText(title)
		setOldText(title);
	}, [title])

	const rollbackTitle = () => {
		setText(oldtext);
		setEditText(false);
	}

	const saveTitle = async () => {

		try {
			await callback(text).then(() => {
				setText(text);
				setOldText(text);
				setEditText(false)
			})


		} catch (error) {
		}
	}

	return (
		<View className="flex-row items-center justify-center">
			{
				!edit
					?
					<>
						<Text className="w-rounded-xl font-regular px-2 py-2 text-base">{text}</Text>
						<LuPenLine size={16} color="gray" onPress={() => setEditText(true)}></LuPenLine>
					</>
					:
					<>
						<TextInput
							className="w-rounded-xl font-regular px-2 py-2 text-base"
							defaultValue={text}
							onChangeText={newText => setText(newText)}
							placeholderTextColor="black"
						/>
						<View className="flex-row items-space-between">
							<TouchableOpacity onPress={saveTitle}>
								<View className="border border-green-500 rounded-md py-1 mr-2 z-10">
									<LuCheck size={16} className="text-green-500 px-4"></LuCheck>
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPress={rollbackTitle}>
								<View className="border border-red-500 rounded-md py-1 mr-2 z-10">
									<LuUnCheck size={16} className="text-red-500 px-4"></LuUnCheck>
								</View>
							</TouchableOpacity>
						</View>
					</>
			}

		</View>
	)
};

export default TitleSummary

const styles = StyleSheet.create({})