import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../styles/colors'
import { paddingScreen } from '../styles/metrics';

class DeviceInfo extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }

    componentDidMount(){
        this.interval = setInterval(() => {
            this.forceUpdate()
        }, 500)
    }
    componentWillUnmount(){
        clearInterval(this.interval)
    }

    renderBattery(){
        let level = parseInt(global.batteryLevel) // [0, 100]
        let status = parseInt(global.batteryState) // [0, 2] 0->NotConnected 1->Charging 2->ChargingDone
        let icon = null

        status = 1

        if(status == 0){
            if(level < 11){ icon = <MaterialCommunityIcons name={'battery-10'} size={22} color={colors.red} /> }
            else if(level < 21){ icon = <MaterialCommunityIcons name={'battery-20'} size={22} color={colors.orange} /> }
            else if(level < 31){ icon = <MaterialCommunityIcons name={'battery-30'} size={22} color={colors.green} /> }
            else if(level < 41){ icon = <MaterialCommunityIcons name={'battery-40'} size={22} color={colors.green} /> }
            else if(level < 51){ icon = <MaterialCommunityIcons name={'battery-50'} size={22} color={colors.green} /> }
            else if(level < 61){ icon = <MaterialCommunityIcons name={'battery-60'} size={22} color={colors.green} /> }
            else if(level < 71){ icon = <MaterialCommunityIcons name={'battery-70'} size={22} color={colors.green} /> }
            else if(level < 81){ icon = <MaterialCommunityIcons name={'battery-80'} size={22} color={colors.green} /> }
            else if(level < 91){ icon = <MaterialCommunityIcons name={'battery-90'} size={22} color={colors.green} /> }
            else if(level <= 100){ icon = <MaterialCommunityIcons name={'battery'} size={22} color={colors.green} /> }
        }else if(status == 1 || status == 2){
            if(level < 11){ icon = <MaterialCommunityIcons name={'battery-charging-10'} size={22} color={colors.green} /> }
            else if(level < 21){ icon = <MaterialCommunityIcons name={'battery-charging-20'} size={22} color={colors.green} /> }
            else if(level < 31){ icon = <MaterialCommunityIcons name={'battery-charging-30'} size={22} color={colors.green} /> }
            else if(level < 41){ icon = <MaterialCommunityIcons name={'battery-charging-40'} size={22} color={colors.green} /> }
            else if(level < 51){ icon = <MaterialCommunityIcons name={'battery-charging-50'} size={22} color={colors.green} /> }
            else if(level < 61){ icon = <MaterialCommunityIcons name={'battery-charging-60'} size={22} color={colors.green} /> }
            else if(level < 71){ icon = <MaterialCommunityIcons name={'battery-charging-70'} size={22} color={colors.green} /> }
            else if(level < 81){ icon = <MaterialCommunityIcons name={'battery-charging-80'} size={22} color={colors.green} /> }
            else if(level < 91){ icon = <MaterialCommunityIcons name={'battery-charging-90'} size={22} color={colors.green} /> }
            else if(level <= 100){ icon = <MaterialCommunityIcons name={'battery-charging-100'} size={22} color={colors.green} /> }
        }
        
        if(this.props.isConnected == false){
            icon = <MaterialCommunityIcons name={'battery-outline'} size={22} color={colors.white} />
        }

        return(
            <View>{icon}</View>
        )

    }
    
    renderBluetooth(){
        if(this.props.isConnected == true){
            return(
                <MaterialCommunityIcons name={'bluetooth'} size={20} color={colors.white} />
            )
        }else{
            return(
                <MaterialCommunityIcons name={'bluetooth-off'} size={20} color={colors.red} />
            )
        }
    }
    
    render() {
        return (
            <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={this.props.onPress}>
                
                <View style={styles.leftContainer}>
                    <MaterialCommunityIcons name={'lightbulb-on'} size={24} color={colors.white} />
                    <View style={styles.leftTextContainer}>
                        <Text style={styles.leftText}>{this.props.name}</Text>
                    </View>
                </View>

                <View style={styles.rightContainer}>
                    <View style={styles.iconContainer}>{this.renderBattery()}</View>
                    <View style={styles.iconContainer}>{this.renderBluetooth()}</View>
                </View>

            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    
    container: {
        backgroundColor: colors.softBlack,
        height: 50,
        flexDirection: 'row',
    },

    leftContainer: {
        flex: 1,
        alignItems: 'center',
        paddingLeft: paddingScreen,
        flexDirection: 'row',
    },

    leftTextContainer: {
        paddingLeft: paddingScreen/1.4,
    },

    leftText: {
        fontFamily: 'Avenir-Book',
        color: colors.white,
        fontSize: 14,
    },
    leftTextSub: {
        fontFamily: 'Avenir-Book',
        color: colors.white,
        fontSize: 12,
    },

    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: paddingScreen,
    },

    iconContainer: {
        paddingHorizontal: paddingScreen/4,
    }

})

const mapStateToProps = (state) => {
	return {
        isConnected: state.deviceReducer.isConnected,
        name: state.deviceReducer.name,
	};
};
  
const mapDispatchToProps = (dispatch) => {
	return {
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceInfo);