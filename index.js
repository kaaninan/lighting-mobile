import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['componentWillReceiveProps']);
LogBox.ignoreLogs(['useNativeDriver']);
LogBox.ignoreLogs(['componentWillMount']);

AppRegistry.registerComponent(appName, () => App);

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

if(__DEV__) {
    import('./ReactotronConfig.js').then(() => console.log('Reactotron Configured'))
  }