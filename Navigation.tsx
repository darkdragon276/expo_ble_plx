import { createStackNavigator } from "@react-navigation/stack";
import Main from './creens/Main';

import { RootStackParamList } from "./model/RootStackParamList";
import SettingsDevice from "./creens/SettingsDevice";
import BLEScanner from "./creens/BLEScanner";

const Stack = createStackNavigator<RootStackParamList>();

const Navigatior = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				cardStyle: { backgroundColor: '#f3f4f6' }
			}}>
			<Stack.Screen
				name='BLEScanner'
				component={BLEScanner}
				options={{
					headerShown: false
				}} >
			</Stack.Screen>
			<Stack.Screen
				name="SettingsDevice"
				component={SettingsDevice}
				options={{
					title: '',
				}} >
			</Stack.Screen>
			<Stack.Screen
				name="Main"
				component={Main}
				options={{
					headerShown: false
				}} >
			</Stack.Screen>
			{/* <Stack.Screen
				name="DeviceCalibration"
				component={DeviceCalibration}
				options={{
					title: 'DeviceCalibration'

				}} >
			</Stack.Screen> */}
		</Stack.Navigator>
	)
}

export default Navigatior

