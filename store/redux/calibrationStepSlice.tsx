import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ClbrationStepState = {
	cn_dv_stt: string,
	ss_init: string,
	hold_dv: string,
	x_axis: string,
	y_axis: string,
	z_axis: string,
	c_cpl: string,
};

let calibrationStepState: ClbrationStepState = {
	cn_dv_stt: "pedding",
	ss_init: "pedding",
	hold_dv: "pedding",
	x_axis: "pedding",
	y_axis: "pedding",
	z_axis: "pedding",
	c_cpl: "pedding",
}

const calibrationStepSlice = createSlice({
	name: "calibrationStep",
	initialState: calibrationStepState,
	reducers: {
		resetStep: (state) => {
			state.cn_dv_stt = "pedding";
			state.ss_init = "pedding";
			state.hold_dv = "pedding";
			state.x_axis = "pedding";
			state.y_axis = "pedding";
			state.z_axis = "pedding";
			state.c_cpl = "pedding";
		},
		updateStep: (state, action: PayloadAction<{ key: keyof ClbrationStepState; value: string }>) => {
			const { key, value } = action.payload;
			state[key] = value;
		}
	}
});

export const updateStep = calibrationStepSlice.actions.updateStep;
export const resetStep = calibrationStepSlice.actions.resetStep;
export default calibrationStepSlice.reducer;