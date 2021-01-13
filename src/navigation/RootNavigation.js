import React from 'react';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack"

import Router from './Router';
import Connect from '../screens/Connect';
import Control from '../screens/Control';

import colors from '../styles/colors';


const RootStack = createStackNavigator({
	
	Router: {
		screen: Router,
		navigationOptions: {
			gesturesEnabled: false
		}
	},


	Connect: {
		screen: Connect,
		navigationOptions: {
			animationEnabled: false,
			gesturesEnabled: false
		}
	},


	Control: {
		screen: Control,
		navigationOptions: {
			animationEnabled: false,
			gesturesEnabled: false
		}
	},


	
	// Registration: {
	// 	screen: RegistrationNavigator,
	// 	// navigationOptions: {
	// 	// 	gesturesEnabled: false
	// 	// }
	// },
	
	// App: {
	// 	screen: AppNavigator,
	// 	navigationOptions: {
	// 		gesturesEnabled: false
	// 	}
	// },

	// ForceUpdate: {
	// 	screen: AppUpdate,
	// 	navigationOptions: {
	// 		gesturesEnabled: false
	// 	}
	// }
	
},
{
	defaultNavigationOptions: {
		headerStyle: {
			backgroundColor: colors.black,
			elevation: 0,
			shadowOpacity: 0.3,
			borderBottomWidth: 0,
		},
		headerTintColor: '#fff',
		headerTitleStyle: {
			fontFamily: 'Avenir-Black',
			fontSize: 18,
			fontWeight: 'bold',
		},
		cardStyle: { backgroundColor: '#000' },
	},
});

export default createAppContainer(RootStack);