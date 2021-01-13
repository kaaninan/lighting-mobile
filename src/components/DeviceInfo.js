import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../styles/colors'
import { paddingScreen } from '../styles/metrics';

export default class DeviceInfo extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }

    renderBattery(){
        return(
            // <MaterialCommunityIcons name={'battery-90-bluetooth'} size={26} color={colors.white} />
            <MaterialCommunityIcons name={'battery-50'} size={22} color={colors.white} />
        )
    }
    
    renderBluetooth(){
        return(
            <MaterialCommunityIcons name={'bluetooth'} size={22} color={colors.white} />
        )
    }
    
    render() {
        return (
            <View style={styles.container}>
                
                <View style={styles.leftContainer}>
                    {/* <MaterialCommunityIcons name={'lightbulb'} size={28} color={colors.white} /> */}
                    {/* <MaterialCommunityIcons name={'lightbulb-off'} size={28} color={colors.white} /> */}
                    <MaterialCommunityIcons name={'lightbulb-on'} size={28} color={colors.white} />
                    <View style={styles.leftTextContainer}>
                        <Text style={styles.leftText}>BAUMIND Studio</Text>
                        <Text style={styles.leftTextSub}>Manual Mode</Text>
                    </View>
                </View>

                <View style={styles.rightContainer}>
                    <View style={styles.iconContainer}>{this.renderBattery()}</View>
                    <View style={styles.iconContainer}>{this.renderBluetooth()}</View>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    
    container: {
        backgroundColor: colors.softBlack,
        height: 60,
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