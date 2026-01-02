import React, { forwardRef, useImperativeHandle, useState } from "react";
import { TextInput } from "react-native";
import { ChildInputRef } from "../../model/ChildRefGetValue";

const AssessmentTitle = forwardRef<ChildInputRef>((props, ref) => {
	const [title, setTitle] = useState("");

	useImperativeHandle(ref, () => ({
		getValue: () => title,
	}));

	return (
		<TextInput
			value={title}
			onChangeText={setTitle}
			placeholder="Enter session name..."
			placeholderTextColor="gray"
			className="w-full rounded-lg px-4 py-2 text-base bg-white"
		/>
	)
});

export default AssessmentTitle