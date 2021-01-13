import { createStackNavigator } from "react-navigation-stack"

import HomeScreen from '../screens/Home/Home';
import ResourcesScreen from '../screens/Home/Resources';

import ConnectLabStarScreen from '../screens/Collect/ConnectLabStar';
import CollectScreen from '../screens/Collect/Collect';
import SensorSelectScreen from '../screens/Collect/SensorSelect';
import ConfigurationScreen from '../screens/Collect/Configuration';
import CompleteExperimentScreen from '../screens/Collect/CompleteExperiment';

import UpdateModals from '../screens/Update/Navigation';

import SettingsScreen from '../screens/Settings/Settings';
import SelectPlanScreen from '../screens/Settings/SelectPlan';
import ProfileScreen from '../screens/Settings/Profile';
import IntroductionScreen from '../screens/Settings/Introduction';

import CollectedDataScreen from '../screens/Analyze/CollectedData';
import CleanDataScreen from '../screens/Analyze/CleanData';
import AnalyzeDataScreen from '../screens/Analyze/AnalyzeData';
import CompleteAnalyzeScreen from '../screens/Analyze/CompleteAnalyze';
import ReportScreen from '../screens/Analyze/Report';

import colors from '../styles/colors';

const MainStack = createStackNavigator({

	HomeScreen: {
		screen: HomeScreen,
		navigationOptions: {
			gestureEnabled: false
		}
	},

	Resources: {
		screen: ResourcesScreen,
	},

	Introduction: {
		screen: IntroductionScreen,
		navigationOptions: {
			gestureEnabled: false
		}
	},

	SelectPlan: {
		screen: SelectPlanScreen,
	},

	Settings: {
		screen: SettingsScreen,
	},
	
	Profile: {
		screen: ProfileScreen,
	},
	
	ConnectLabStar: {
		screen: ConnectLabStarScreen,
	},

	Collect: {
		screen: CollectScreen,
		navigationOptions: {
			gestureEnabled: false
		}
	},

	SensorSelect: {
		screen: SensorSelectScreen,
	},

	Configuration: {
		screen: ConfigurationScreen,
	},

	CompleteExperiment: {
		screen: CompleteExperimentScreen,
		navigationOptions: {
			gestureEnabled: false
		}
	},

	CollectedData: {
		screen: CollectedDataScreen,
	},

	CleanData: {
		screen: CleanDataScreen,
		navigationOptions: {
			// gestureEnabled: false
		}
	},

	AnalyzeData: {
		screen: AnalyzeDataScreen,
		navigationOptions: {
			// gestureEnabled: false
		}
	},
	
	CompleteAnalyze: {
		screen: CompleteAnalyzeScreen,
	},

	Report: {
		screen: ReportScreen,
		navigationOptions: {
			// gestureEnabled: false
		}
	},

},
{
	defaultNavigationOptions: {
		headerStyle: {
			backgroundColor: colors.bluePrimary,
		},
		headerTintColor: '#fff',
		headerTitleStyle: {
			fontFamily: 'Avenir-Black',
			fontSize: 18,
			fontWeight: 'bold',
		},
		cardStyle: { backgroundColor: '#FFF' },
	},
});


const AppNavigator = createStackNavigator({
	
	AppMain: {
		screen: MainStack,
		navigationOptions: {
			header: null,
		},
	},

	// Modals

	AppUpdate: {
		screen: UpdateModals,
		navigationOptions: {
			header: null,
			gestureEnabled: false,
		},
	},

},
{
	mode: 'modal',
	defaultNavigationOptions: {
		
	},
})





export default AppNavigator;