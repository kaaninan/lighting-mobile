import React from 'react';
import { View, Platform, ActivityIndicator } from 'react-native';

import { connect } from 'react-redux';

import SplashScreen from 'react-native-splash-screen';
import Orientation from 'react-native-orientation-locker';
import AsyncStorage from '@react-native-async-storage/async-storage';


class Router extends React.Component {

	constructor(props) {
		super(props);
    }
    
	async componentDidMount(){

		// handle orientation
		if(Platform.OS == 'ios' && Platform.isPad == true){
			Orientation.unlockAllOrientations();
		}else{
			Orientation.lockToPortrait();
		}
		
		this.props.navigation.replace("Connect");
		// this.props.navigation.replace("Control");
		setTimeout(() => SplashScreen.hide())
	}

	render() {
		return (
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<ActivityIndicator />
			</View>
		);
	}
}

const mapStateToProps = (state) => {
    return {
        // loggedIn: state.authReducer.loggedIn,
		// user: state.authReducer.user,
		// list: state.experimentReducer.list,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // update: (payload) => dispatch(update(payload)),
        // create: (payload) => dispatch(create(payload)),
        // logout: () => dispatch(logout()),
        // disable_classroom: () => dispatch(disable_classroom()),
        // reset: () => dispatch(reset()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Router);