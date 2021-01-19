import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../styles/colors'
import { paddingScreen } from '../styles/metrics';
import { ifIphoneX } from 'react-native-iphone-x-helper'

export default class ConnectionStatus extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             
        }

        
    }

    onPress = () => {
        if(this.props.status == 'disconnected'){
            this.props.navigation.replace('Connect')
        }
    }

    render() {
        return (
            <TouchableOpacity onPress={this.onPress} activeOpacity={0.9} style={[
                styles.container, 
                this.props.status == 'connected' ? {backgroundColor: colors.batteryGreen} : null,
                this.props.status == 'disconnected' ? {backgroundColor: colors.red} : null,
                this.props.status == 'connecting' ? {backgroundColor: colors.orange} : null,
                ]}>

                {this.props.status == 'connected' ?
                <SafeAreaView style={styles.contentContainer}>
                    <Ionicons name={'checkmark'} size={20} color={colors.white} />
                    <Text style={styles.text}>Connected</Text>
                </SafeAreaView>
                :null}
                
                {this.props.status == 'disconnected' ?
                <SafeAreaView style={styles.contentContainer}>
                    <Ionicons name={'close-outline'} size={28} color={colors.white} />
                    <Text style={styles.text}>Disconnected</Text>
                </SafeAreaView>
                :null}
                
                {this.props.status == 'connecting' ?
                <SafeAreaView style={styles.contentContainer}>
                    {/* <Ionicons name={'close-outline'} size={28} color={colors.white} /> */}
                    <ActivityIndicator color="white" size='small' />
                    <Text style={styles.text}>Connecting</Text>
                </SafeAreaView>
                :null}
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: paddingScreen,
        ...ifIphoneX({
            height: 70
        }, {
            height: 50
        })
    },

    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    text: {
        fontFamily: 'Avenir-Book',
        color: colors.white,
        fontSize: 14,
        marginLeft: paddingScreen/3,
        paddingTop: 3,
    },

})