import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type romTypeState = {
	startRecording: boolean | any;
	extension: number | any;
	flexion: number | any;
	l_rotation: number | any;
	r_rotation: number | any;
	l_lateral: number | any;
	r_lateral: number | any;
	duration: number | any;
};

let romState: romTypeState = {
	startRecording: false,
	extension: 0.0,
	flexion: 0.0,
	l_rotation: 0.0,
	r_rotation: 0.0,
	l_lateral: 0.0,
	r_lateral: 0.0,
	duration: 0.0,
}

const rangeOfMotionSlice = createSlice({
	name: "rangeOfMotion",
	initialState: romState,
	reducers: {
		resetROM: (state) => {
			state.startRecording = false;
			state.extension = 0.0;
			state.flexion = 0.0;
			state.l_rotation = 0.0;
			state.r_rotation = 0.0;
			state.l_lateral = 0.0;
			state.r_lateral = 0.0;
			state.duration = 0.0;
		},
		updateROM: (state, action: PayloadAction<{ key: keyof romTypeState; value: any }>) => {
			const { key, value } = action.payload;
			state[key] = value;
		}
	}
});

export const resetROM = rangeOfMotionSlice.actions.resetROM;
export const updateROM = rangeOfMotionSlice.actions.updateROM;
export default rangeOfMotionSlice.reducer;