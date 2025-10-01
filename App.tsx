import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import Navigatior from './Navigation';
import { Provider } from 'react-redux';
import { store } from './store/redux/store'

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Navigatior></Navigatior>
      </NavigationContainer>
    </Provider>
  );
}
