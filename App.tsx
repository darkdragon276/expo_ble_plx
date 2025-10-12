import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import Navigatior from './Navigation';
import { Provider } from 'react-redux';
import { store } from './store/redux/store'
import { useEffect, useState } from 'react';
import SplashScreen from './creens/SplashScreen';
import { BLEService } from './ble/BLEService';

export default function App() {

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let cyclingIntervalId: NodeJS.Timeout | undefined;

        cyclingIntervalId = setInterval(() => {
            BLEService.updateDeviceAndState1s();
        }, 1000);

        const initialize = async () => {
            await initApp();
            setIsReady(true);
        };
        initialize();

        return () => {
            if (cyclingIntervalId) {
                clearInterval(cyclingIntervalId);
            }
        };
    }, []);

    const initApp = async (): Promise<void> => {
        await BLEService.initializeBLE();
        await BLEService.requestBluetoothPermission();
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    return (
        <Provider store={store}>
            <StatusBar style="dark" />
            {
                isReady
                    ?
                    <NavigationContainer>
                        <Navigatior></Navigatior>
                    </NavigationContainer>
                    :
                    <SplashScreen></SplashScreen>
            }
        </Provider>
    );
}
