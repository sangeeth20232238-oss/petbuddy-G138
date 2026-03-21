import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import App from './App';

if (!AppRegistry.getAppKeys().includes('main')) {
  registerRootComponent(App);
}
