import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    ActivityIndicator,
    Platform,
    SafeAreaView,
    AppState,
    Dimensions,
    View,
    FlatList,
    TouchableOpacity,
    Keyboard,
} from 'react-native'

import { connect } from 'react-redux';
import { connectDevice, disconnectDevice } from '../redux/actions/deviceActions'

import colors from '../styles/colors'
import { paddingScreen } from '../styles/metrics'
import * as Animatable from 'react-native-animatable';

import Container from '../components/Container';
import Button from '../components/Button';
import AlertBox from '../components/AlertBox';

import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import { Buffer } from 'buffer';

import { ColorPicker } from 'react-native-color-picker'
import DeviceInfo from '../components/DeviceInfo';
import ControlComponent from '../components/ControlComponent';

class Control extends Component {

    static navigationOptions = ({navigation}) => ({
        headerTitle: "Light",
        // headerLeft: <HeaderBack onPress={() => navigation.goBack('list-1')} />,
        // headerRight: <HeaderInfo onPress={() => navigation.state.params.onPressInfo()} />,
    })

    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,
            appState: AppState.currentState,
            selectedIndex: 0,

            isAlertShows: false,

            // Color
            color: {
                hue: 0.5,
                saturation: 1,
                value: 1,
            },

            mode: 1,
            light: 0,
        }

    }

    // Overflow
    // GET VALUES
    // () => SET VALUES
    // () => RECONNECT


    componentDidMount() {
        // this.colorP._onSValueChange();
    }

    changeLedStatus = () => {
        // TODO: Bluetooth
        let newState = 0
        if(this.state.light == 0){ newState = 1 }
        setTimeout(() => {
            this.setState({light: newState})
            this.forceUpdate()
        }, 100)
    }

    changeColor = ({color}) => {
        // TODO: Bluetooth
        this.setState({
            color: {
                hue: color.hue,
                saturation: color.saturation,
                value: color.value,
            }
        })
    }

    render() {

        if(this.state.loading){
            return (
                <Container contentContainerStyle={{alignItems: 'center'}}>
                    <Text>Loading</Text>
                </Container>
            )
        }else{
            return (
                <Container style={{marginBottom: paddingScreen * 3}}>
                    
                    <SafeAreaView style={{flex: 1}}>

                        <DeviceInfo />

                        <ControlComponent
                            value={this.state.light}
                            values={['Off', 'On']}
                            type={'segment'}
                            onValueChange={value => { this.changeLedStatus() }}
                            style={{ marginVertical: paddingScreen }} />
                        
                        <ColorPicker
                            onColorChange={color => this.changeColor({
                                color: {
                                    hue: color.h/360,
                                    saturation: this.state.color.saturation,
                                    value: this.state.color.value,
                                }
                            })}
                            color={{
                                h: this.state.color.hue * 360,
                                s: this.state.color.saturation,
                                v: this.state.color.value
                            }}
                            ref={(c) => this.colorP = c}
                            onColorSelected={(color) => this.changeLedStatus()}
                            style={{ flex: 1, marginBottom: paddingScreen / 2}}
                            hideSliders={true} />

                        <ControlComponent
                            value={this.state.color.hue}
                            text={'Hue'}
                            type={'degree'}
                            onValueChange={value => this.changeColor({
                                color: {
                                    hue: value,
                                    saturation: this.state.color.saturation,
                                    value: this.state.color.value,
                                }
                            })} />

                        <ControlComponent
                            value={this.state.color.saturation}
                            text={'Saturation'}
                            type={'percent'}
                            onValueChange={value => this.changeColor({
                                color: {
                                    hue: this.state.color.hue,
                                    saturation: value,
                                    value: this.state.color.value,
                                }
                            })} />

                        <ControlComponent
                            value={this.state.color.value}
                            text={'Brightness'}
                            type={'percent'}
                            onValueChange={value => this.changeColor({
                                color: {
                                    hue: this.state.color.hue,
                                    saturation: this.state.color.saturation,
                                    value: value,
                                }
                            })} />

                        <ControlComponent
                            value={this.state.mode}
                            values={['Manual', 'Automatic']}
                            text={'Mode'}
                            type={'segment'}
                            onValueChange={value => this.setState({
                                mode: value
                            })} />
                    
                    </SafeAreaView>

                </Container>
            )
        }
    }

}



const styles = StyleSheet.create({

    listContainer:{
        flex: 1,
    },

    listView: {
        flex: 1,
        opacity: 0,
        backgroundColor: colors.white,
        marginHorizontal: -paddingScreen,
    },

    
    listItemContainer:{
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 10,
    },

    listItem:{
        fontSize: 21,
        fontFamily: 'Rubik-Medium',
        textAlign: 'center',
        color: colors.white,
    },



    lottieContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 50,
        marginVertical: 50,
        height: 300,
        zIndex: 1,
    },

    lottie: {
        zIndex: 1,
        width: '80%',
    },


    

    infoContainer: {
        marginTop: 50,
        marginBottom: 50,
        paddingHorizontal: 24,
    },

    infoText: {
        fontFamily: 'Rubik-Bold',
        fontSize: 18,
        textAlign: 'center',
        color: colors.white,
    },


})



const mapStateToProps = (state) => {
	return {
        isConnected: state.deviceReducer.isConnected,
        device: state.deviceReducer.device,
        deviceName: state.deviceReducer.name,
	};
};
  
const mapDispatchToProps = (dispatch) => {
	return {
		connectDevice: (data) => dispatch(connectDevice(data)),
		disconnectDevice: () => dispatch(disconnectDevice()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Control);