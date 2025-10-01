import { configureStore } from '@reduxjs/toolkit';
import calibrationReducer from './calibrationStepSlice'
import rangeOfMotionSlice from './rangeOfMotionSlice'

const store = configureStore({
	reducer: {
		calibration: calibrationReducer,
		rangeOfMotion: rangeOfMotionSlice,
	}
})

export { store }