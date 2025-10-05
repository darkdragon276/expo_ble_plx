import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './model/RootStackParamList'
import Main from './creens/Main';
import SettingsDevice from './creens/SettingsDevice';
import DeviceCalibration from './creens/DeviceCalibration';
import AssessmentSelection from './creens/AssessmentSelection';
import RangeOfMotion from './creens/RangeOfMotion';
import BLEScanner from "./creens/BLEScanner";
import RangeOfMotionSummary from './creens/RangeOfMotionSummary';

const Stack = createStackNavigator<RootStackParamList>();

const Navigatior = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				cardStyle: { backgroundColor: '#f3f4f6' }
			}}>
			{/* <Stack.Screen
				name='BLEScanner'
				component={BLEScanner}
				options={{
					headerShown: false
				}} >
			</Stack.Screen> */}
			<Stack.Screen
				name="Main"
				component={Main}
				options={{
					headerShown: false
				}} >
			</Stack.Screen>
			<Stack.Screen
				name="AssessmentSelection"
				component={AssessmentSelection}
				options={{
					title: '',
				}} >
			</Stack.Screen>
			<Stack.Screen
				name="RangeOfMotion"
				component={RangeOfMotion}
			>
			</Stack.Screen>
			<Stack.Screen
				name="RangeOfMotionSummary"
				component={RangeOfMotionSummary}
			>
			</Stack.Screen>
			<Stack.Screen
				name="SettingsDevice"
				component={SettingsDevice}
				options={{
					title: '',
				}} >
			</Stack.Screen>
			<Stack.Screen
				name="DeviceCalibration"
				component={DeviceCalibration}
				options={{
					title: 'DeviceCalibration'
				}} >
			</Stack.Screen>
		</Stack.Navigator>
	)
}

export default Navigatior
