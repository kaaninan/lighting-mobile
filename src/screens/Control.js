import React, { Component } from 'react'
import {
    StyleSheet,
    AppState,
    View,
} from 'react-native'

import { connect } from 'react-redux';
import { connectDevice, disconnectDevice } from '../redux/actions/deviceActions'

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { paddingScreen } from '../styles/metrics'
import * as Animatable from 'react-native-animatable';
import ActionSheet from 'react-native-actionsheet'

import Container from '../components/Container';

import { Buffer } from 'buffer';
import DropdownAlert from 'react-native-dropdownalert';

import DeviceInfo from '../components/DeviceInfo';
import ControlComponent from '../components/ControlComponent';
import ScreenLoading from '../components/ScreenLoading';
import ConnectionStatus from '../components/ConnectionStatus';

import {service, characteristic} from '../bluetooth/services'
import command from '../bluetooth/commands'

class Control extends Component {

    static navigationOptions = ({navigation}) => ({
        headerTitle: "Lighting",
        // headerLeft: <HeaderBack onPress={() => navigation.goBack('list-1')} />,
        // headerRight: <HeaderInfo onPress={() => navigation.state.params.onPressInfo()} />,
    })

    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,
            appState: AppState.currentState,

            // Color
            ledColor: {
                hue: 0, // range:[0,1]
                saturation: 0, // range:[0,1]
                value: 0, // range:[0,1]
            },
            ledMode: 0,
            ledStatus: 0,

            connectionStatus: 'connecting', // <ConnectionStatus/> text,color
        }

        this.isAlertShown = false; // componentDidUpdate'de surekli setState yaptirmamak icin (Disconnect oldugunda)
        this.isHideConnectionStatus = true // <ConnectionStatus/> animation state
        this.bluetoothMonitorEnable = false // Ust uste characteristic monitor etmemek icin
    }


    componentDidMount() {
        this.checkConnection()
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount(){
        AppState.removeEventListener('change', this._handleAppStateChange);
    }


    _handleAppStateChange = (nextAppState) => {
        clearTimeout(this.uiTimeout)
        if ( this.state.appState.match(/inactive|background/) && nextAppState === 'active' ) {
            this.checkConnection()
        }
        this.setState({appState: nextAppState});
    };


    componentDidUpdate(){
        // LabStar baglantisi koparsa && ConnectLabStar'daki montior ile burasi calisir
        if(this.props.isConnected == false && this.isAlertShown == false){
            this.uiDisconnect(navigation = false)
            this.isAlertShown = true
        }
    }



    // BLUETOOTH
    checkConnection = () => {
        try {
            this.uiConnecting()

            if(this.props.device != null && this.props.isConnected){
                this.props.device.isConnected().then(d => {

                    // SET VALUES
                    var promise1 = this.props.device.readCharacteristicForService(service.led, characteristic.led_status)
                    var promise2 = this.props.device.readCharacteristicForService(service.led, characteristic.led_value)
                    var promise3 = this.props.device.readCharacteristicForService(service.led, characteristic.led_mode)
                    
                    Promise.all([promise1, promise2, promise3]).then((values) => {
                        var lStatus = parseInt(Buffer.from(values[0].value, 'base64').toString('ascii'))
                        var lValue = Buffer.from(values[1].value, 'base64').toString('ascii').split('#')
                        var lMode = parseInt(Buffer.from(values[2].value, 'base64').toString('ascii'))

                        this.setState({
                            ledStatus: lStatus,
                            ledMode: lMode,
                            ledColor: {
                                hue: parseInt(lValue[0]).map(0, 65535, 0, 1),
                                saturation: parseInt(lValue[1]).map(0, 255, 0, 1),
                                value: parseInt(lValue[2]).map(0, 255, 0, 1),
                            }
                        })

                        this.uiTimeout = setTimeout(() => {
                            this.uiConnect()
                            this.monitor()
                        }, 1000)
                    })

                })
            }else{
                this.uiDisconnect(navigation = false)
            }

        } catch (error) {
            console.warn(error)
        }
    }


    monitor = () => {
        if(this.props.isConnected == true && this.bluetoothMonitorEnable == false){

            this.bluetoothMonitorEnable == true

            // console.log("Start Monitoring")

            this.props.device.monitorCharacteristicForService(service.led, characteristic.led_mode, (error, characteristic) => {
                if(error == null){
                    var incoming = Buffer.from(characteristic.value, 'base64').toString('ascii')
                    
                }
            }, 'ledMode')

            this.props.device.monitorCharacteristicForService(service.led, characteristic.led_value, (error, characteristic) => {
                if(error == null){

                    var lValue = Buffer.from(characteristic.value, 'base64').toString('ascii').split('#')
                    // console.log(lValue, this.state.ledMode)

                    // Automatic mod'da degerleri set et
                    if(this.state.ledMode == 1){
                        this.setState({
                            ledColor: {
                                hue: parseInt(lValue[0]).map(0, 65535, 0, 1),
                                saturation: parseInt(lValue[1]).map(0, 255, 0, 1),
                                value: parseInt(lValue[2]).map(0, 255, 0, 1),
                            }
                        })
                    }
                }
            }, 'ledValue')

            this.props.device.monitorCharacteristicForService(service.led, characteristic.led_status, (error, characteristic) => {
                if(error == null){
                    var incoming = Buffer.from(characteristic.value, 'base64').toString('ascii')
                    // console.log('status', incoming)
                }
            }, 'ledStatus')
        }else{
            console.warn('no monitoring')
        }
    }



    // --- UI ---

    // Private
    uiConnectionStatus = (show = true) => {
        if(show == true){
            if(this.isHideConnectionStatus == true){
                this._connectionStatus.fadeInUp(1000)
                this.isHideConnectionStatus = false
            }
        }else{
            if(this.isHideConnectionStatus == false){
                this._connectionStatus.fadeOutDown(1000)
                this.isHideConnectionStatus = true
            }
        }
    }

    // Public
    uiConnecting = () => {
        this.setState({connectionStatus: 'connecting'})
        this.uiConnectionStatus(true)
    }

    uiConnect = () => {
        this.setState({connectionStatus: 'connected'})
        this.uiConnectionStatus(true)
        this.uiTimeout = setTimeout(() => {
            this.uiConnectionStatus(false)
        }, 2000)
    }

    uiDisconnect = (navigate = false) => {
        this.setState({connectionStatus: 'disconnected'})
        clearTimeout(this.uiTimeout) // Eger onceden fadeOutDown set edilmis ise iptal et
        this.uiConnectionStatus(true)

        this.bluetoothMonitorEnable = false

        if(navigate){
            this.uiTimeout = setTimeout(() => {
                this.props.navigation.replace('Connect')
            }, 5000)
        }
    }


    // --- EVENTS ---

    changeLedStatus = (value) => {

        if(value == null){
            if(this.state.ledStatus == 0){ value = 1 }
            else{ value = 0 }
        }

        command.sendCommandWithoutResponse(this.props.device, 'ledStatus', {status: value})
            .then(() => {})
            .catch(error => {
                console.warn(error)
                this.dropDownAlertRef.alertWithType('error', 'Error', "Could not connect to device.");
            })

        setTimeout(() => {
            this.setState({ledStatus: value})
            this.forceUpdate() // ColorPicker'dan basildigi zaman update etmesi icin
        }, 10)
    }

    changeLedMode = (value) => {

        // Eger auto mod'a gectiyse led status = 1 ya[]
        if(this.state.ledStatus == 0 && value == 1){
            this.changeLedStatus(1)
        }
        
        command.sendCommandWithoutResponse(this.props.device, 'ledMode', {mode: value})
            .then(() => {})
            .catch(error => {
                console.warn(error)
                this.dropDownAlertRef.alertWithType('error', 'Error', "Could not connect to device.");
            })

        this.setState({ledMode: value})
    }

    changeLedColor = ({color}) => {

        // Eger Led Status = 0 ve manual modda iken deger degistirilir ise ledi yak
        if(this.state.ledStatus == 0 && this.state.ledMode == 0){
            this.changeLedStatus(1)
        }

        // hue => [0, 1] => [0, 65535]
        // sat => [0, 1] => [0, 255]
        // value => [0, 1] => [0, 255]

        // MAP VALUES
        let sendHue = parseInt(color.hue.map(0, 1, 0, 65535))
        let sendSaturation = parseInt(color.saturation.map(0, 1, 0, 255))
        let sendValue = parseInt(color.value.map(0, 1, 0, 255))
        let sendBrightness = 255

        // console.warn(sendHue, sendSaturation, sendValue, sendBrightness)

        command.sendCommandWithoutResponse(this.props.device, 'ledValue', {hue: sendHue, sat: sendSaturation, val: sendValue, bright: sendBrightness})
            .then(() => {})
            .catch(error => {
                console.warn(error)
                this.dropDownAlertRef.alertWithType('error', 'Error', "Could not connect to LabStar");
            })

        this.setState({
            ledColor: {
                hue: color.hue,
                saturation: color.saturation,
                value: color.value,
            }
        })
    }

    actionDisconnect = (index) => {
        if(index == 0){
            this.props.disconnectDevice()
        }
    }

    render() {

        if(this.state.loading){
            return (
                <ScreenLoading text={'Connecting..'} />
            )
        }else{
            return (
                <Container style={{flex: 1}}>

                    <View style={{position: 'absolute', top: 0, right: 0, left: 0, height: 20, zIndex: 1}}>
                        <DropdownAlert updateStatusBar={false} ref={ref => this.dropDownAlertRef = ref} />
                    </View>

                    <ActionSheet
                        ref={o => this.ActionSheetBluetooth = o}
                        title={'Disconnect from this device?'}
                        options={['Disconnect', 'Cancel']}
                        cancelButtonIndex={1}
                        destructiveButtonIndex={0}
                        onPress={(index) => { this.actionDisconnect(index) }}
                    />
                    
                    <DeviceInfo onPress={() => this.props.isConnected ? this.ActionSheetBluetooth.show() : null } />

                    {/* ON - OFF */}
                    <ControlComponent
                        value={this.state.ledStatus}
                        disabled={this.state.connectionStatus == 'connecting' || this.state.connectionStatus == 'disconnected'}
                        values={['Off', 'On']}
                        type={'segment'}
                        onValueChange={value => { this.changeLedStatus(value) }}
                        style={{ marginVertical: paddingScreen }} />
                    
                    {/* COLOR PICKER */}
                    <Animatable.View delay={0} duration={500} animation='fadeInUp' useNativeDriver style={{flex: 1}}>
                    <ControlComponent
                        value={this.state.ledColor}
                        disabled={this.state.connectionStatus == 'connecting' || this.state.ledMode == 1 ? true : false || this.state.connectionStatus == 'disconnected'}
                        type={'colorPicker'}
                        onValueChange={value => { this.changeLedColor(value) }}
                        onColorSelected={() => this.changeLedStatus()}
                        style={{ flex: 1, marginBottom: paddingScreen / 2}}
                        />
                    </Animatable.View>

                    {/* HUE SLIDER */}
                    <Animatable.View delay={100} duration={500} animation='fadeInUp' useNativeDriver>
                    <ControlComponent
                        value={this.state.ledColor.hue}
                        disabled={this.state.connectionStatus == 'connecting' || this.state.ledMode == 1 ? true : false || this.state.connectionStatus == 'disconnected'}
                        animation={this.state.ledMode == 0 ? false : true}
                        text={'Hue'}
                        type={'degree'}
                        onValueChange={value => this.changeLedColor({
                            color: {
                                hue: value,
                                saturation: this.state.ledColor.saturation,
                                value: this.state.ledColor.value,
                            }
                        })} />
                    </Animatable.View>

                    {/* SATURATION SLIDER */}
                    <Animatable.View delay={200} duration={500} animation='fadeInUp' useNativeDriver>
                    <ControlComponent
                        value={this.state.ledColor.saturation}
                        disabled={this.state.connectionStatus == 'connecting' || this.state.ledMode == 1 ? true : false || this.state.connectionStatus == 'disconnected'}
                        animation={this.state.ledMode == 0 ? false : true}
                        text={'Saturation'}
                        type={'percent'}
                        onValueChange={value => this.changeLedColor({
                            color: {
                                hue: this.state.ledColor.hue,
                                saturation: value,
                                value: this.state.ledColor.value,
                            }
                        })} />
                    </Animatable.View>

                    {/* VALUE SLIDER */}
                    <Animatable.View delay={300} duration={500} animation='fadeInUp' useNativeDriver>
                    <ControlComponent
                        value={this.state.ledColor.value}
                        disabled={this.state.connectionStatus == 'connecting' || this.state.ledMode == 1 ? true : false || this.state.connectionStatus == 'disconnected'}
                        animation={this.state.ledMode == 0 ? false : true}
                        text={'Value'}
                        type={'percent'}
                        onValueChange={value => this.changeLedColor({
                            color: {
                                hue: this.state.ledColor.hue,
                                saturation: this.state.ledColor.saturation,
                                value: value,
                            }
                        })} />
                    </Animatable.View>

                    {/* MDOE SELECT */}
                    <Animatable.View delay={400} duration={500} animation='fadeInUp' useNativeDriver>
                    <ControlComponent
                        value={this.state.ledMode}
                        disabled={this.state.connectionStatus == 'connecting' ? true : false || this.state.connectionStatus == 'disconnected'}
                        values={['Manual', 'Automatic']}
                        text={'Mode'}
                        type={'segment'}
                        onValueChange={value => { this.changeLedMode(value) }}
                        style={{
                            ...ifIphoneX({
                                paddingBottom: 70 + paddingScreen
                            }, {
                                paddingBottom: 50 + paddingScreen
                            })
                        }}
                        />
                    </Animatable.View>

                    {/* CONNECTION STATUS */}
                    <Animatable.View ref={(c) => this._connectionStatus = c } style={{opacity: 0}} useNativeDriver>
                        <ConnectionStatus navigation={this.props.navigation} status={this.state.connectionStatus} />
                    </Animatable.View>
                
                </Container>
            )
        }
    }

}



const styles = StyleSheet.create({



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