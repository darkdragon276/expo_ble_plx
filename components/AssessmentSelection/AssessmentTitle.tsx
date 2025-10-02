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
			placeholder="Session Name (Optional)"
			placeholderTextColor="black"
			className="w-full rounded-xl px-4 py-4 text-base"
		/>
	)
});

export default AssessmentTitle