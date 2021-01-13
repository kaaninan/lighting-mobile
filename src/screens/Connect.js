import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    ActivityIndicator,
    Platform,
    SafeAreaView,
    AppState,
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
import { BleManager } from 'react-native-ble-plx';
import {check, PERMISSIONS, RESULTS, request, openSettings} from 'react-native-permissions';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { BluetoothStatus } from 'react-native-bluetooth-status';
import DropdownAlert from 'react-native-dropdownalert';
import Dialog from "react-native-dialog";
import { BlurView } from "@react-native-community/blur";


class Connect extends Component {

    static navigationOptions = ({navigation}) => ({
        headerTitle: "Connect",
        // headerLeft: <HeaderBack onPress={() => navigation.goBack('list-1')} />,
        // headerRight: <HeaderInfo onPress={() => navigation.state.params.onPressInfo()} />,
    })

    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,
            appState: AppState.currentState,

            isAlertShows: false,
        }

        this.manager = new BleManager('restoreStateIdentifier', );
        this.deviceList = new Array();
        this.device = null;

        this.permissionStatus = false;
        this.bluetoothState = false;
        this.androidLocationStatus = true;

        this.errorText = ''; // For AlertBox

        this.isListShows = false;
        this.connecting = false;
    }

    // Overflow
    // A0. Prepare Data Buffer (async)
    // A1. Permission Check
    // A2. Bluetooth State Check
    // B1. Handle Alert Box
    // C1. Start Bluetooth
    // C2. Scan Bluetooth
    // C3. Examine Bluetooth
    // C4. Connect Bluetooth


    componentDidMount() {

        // this.props.navigation.replace('Monitor')
        // return

        // If already connected to device go checkStatus directly
        if(this.props.device != null && this.props.isConnected == true){
            this.setState({loading: true})
            // to be sure, connect again

            if(Platform.OS == 'android'){
                this.device = this.props.device; // for _stopExperiment
                // add distance to saved redux experiment
                this.moveOn(this.props.device);
            
            }else{
                this.props.device.connect({timeout: 5000, autoConnect: false, requestMTU: 256})
                    .then((device) => {
                        return device.discoverAllServicesAndCharacteristics();
                    })
                    .then((device) => {
                        // this.manager.isDeviceConnected(device.id).then(d => {
                            this.device = device; // for _stopExperiment
                            // add distance to saved redux experiment
                            this.moveOn(device);
                    // })
                })
            }
        }

        AppState.addEventListener('change', this._handleAppStateChange);
        this._navListener = this.props.navigation.addListener('willFocus', payload => {
            this.checkPermission();
        })
    }

    // For iOS, Andriod background state
    _handleAppStateChange = (nextAppState) => {
        if ( this.state.appState.match(/inactive|background/) && nextAppState === 'active' ) {
            this.checkPermission();
        }
        this.setState({appState: nextAppState});
    };

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);   
        if(this._navListener){ this._navListener.remove() }
        this.bluetoothStop();
    }


    // A1
    checkPermission = () => {

        // eger baglantida hata olursa tekrardan liste secilebilir olsun
        this.connecting = false;

        // iOS icin Bluetooth izni ve Bluteooth Status bakiliyor
        // Android icin Location izni ve Bluteooth Status bakiliyor

        if(Platform.OS === 'ios'){
            check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL)
                .then(result => {
                    switch (result) {
                        case RESULTS.UNAVAILABLE:
                            this.errorText = 'This feature is not available (on this device / in this context)';
                            this.permissionStatus = false;
                            break;
                        case RESULTS.DENIED:
                            this.errorText = 'You will need Bluetooth to collect live data with bluetooth device.';
                            this.permissionStatus = false;
                            break;
                        case RESULTS.GRANTED:
                            this.permissionStatus = true;
                            break;
                        case RESULTS.BLOCKED:
                            this.errorText = 'You will need Bluetooth to collect live data with bluetooth device.';
                            this.permissionStatus = false;
                            break;
                    }
                })
                .then(() => {
                    if(this.permissionStatus == false){
                        this.handleAlertBox()
                    }else{
                        this.checkBluetoothState();
                    }
                })
                .catch(error => {
                    this.errorText = 'You will need Bluetooth to collect live data with bluetooth device.';
                    this.handleAlertBox()
                });

        }else if(Platform.OS === 'android'){
            check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION)
                .then(result => {
                    switch (result) {
                        case RESULTS.UNAVAILABLE:
                            this.errorText = 'This feature is not available (on this device / in this context)';
                            this.permissionStatus = false;
                            break;
                        case RESULTS.DENIED:
                            this.errorText = 'Bluetooth cannot be used because app does not have permission to location access.';
                            this.permissionStatus = false;
                            break;
                        case RESULTS.GRANTED:
                            this.permissionStatus = true;
                            break;
                        case RESULTS.BLOCKED:
                            this.errorText = 'Bluetooth cannot be used because app does not have permission to location access.';
                            this.permissionStatus = false;
                            break;
                    }
                })
                .then(() => {
                    if(this.permissionStatus == false){
                        request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then(e => {
                            this.checkPermission()
                        })
                        this.handleAlertBox()
                    }
                })
                .then(() => {
                    if(this.permissionStatus == true){
                        // Open Location
                        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 999999999, fastInterval: 999999999})
                            .then(data => {
                                this.androidLocationStatus = true
                                this.checkBluetoothState();

                            }).catch(err => {
                                this.androidLocationStatus = false
                                this.errorText = 'Please turn on your GPS to use Bluetooth.';
                                this.handleAlertBox();
                            });
                        }
                })
                .catch(error => {
                    this.errorText = 'Bluetooth cannot be used because app does not have permission to location access.';
                    this.handleAlertBox()
                });
        }



         
    }

    // A2
    checkBluetoothState = () => {

        try {
            BluetoothStatus.state()
                .then(status => {
                    if(status == false){
                        this.errorText = 'Please turn on your Bluetooth';
                        this.bluetoothState = false;
                        this.handleAlertBox();
                    }else{
                        this.bluetoothState = true;
                        this.handleAlertBox();
                    }
                })
        } catch (error) {
            // console.error(error);
            this.errorText = 'Please turn on your Bluetooth';
            this.bluetoothState = false;
            this.handleAlertBox();
        }
    }

    // B1
    handleAlertBox = () => {  

        if(this.permissionStatus == false || this.bluetoothState == false || this.androidLocationStatus == false){
            // 1. Eger izinler verilmemisse uyari goster
            // 2. Eger bluetooth kapali ise uyari goster
            // 3. Embedded versionu ile uyum saglamiyorsa goster (App guncellenecek)
            this.setState({}); // put this.errorText in AlertBox
            this.showAlertBox();
            this.hideDeviceList(); // onceden bulunmus liste varsa kapat

        }else{
            // Her sey normal
            this.hideAlertBox();
            // Baglantiya basla
            this.startConnection();
        }
    }

    // C1
    startConnection = () => {


        // Daha once arama yapilmis ve liste gosterilmisse kapat
        if(this.isListShows == true){
            this.hideDeviceList().then(() => {
                setTimeout(() => {
                    this.bluetoothStart();
                }, 1000);
            })
        }else{
            this.bluetoothStart();
        }
    }



    bluetoothStart(){

        const subscription = this.manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                this.scan();
                this.subscription.remove();
            }
        }, true);
        this.subscription = subscription;
    }

    bluetoothStop(){
        clearInterval(this.interval);
        this.manager.stopDeviceScan();
    }

    // C2
    scan() {
        
        // Arama otomatik bitmiyor, her 500ms sonra bulunan cihazlari incele, device bulunca arama sonlandiriliyor
        this.interval = setInterval(() => { this.examine(); }, 500);

        // Device list i sifirla
        this.deviceList = new Array();

        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.warn(error)
                if(error.errorCode == 102){
                    // Bluetooth kapatildi, aramayi durdur
                    this.bluetoothStop();
                }
                return
            }

            // Butun cihazlari listeye ekle
            if(device.name != null){
                if((device.name).includes('Core') || (device.name).includes('CORE')){
                    var move_on = 1;

                    // Ayni cihazi defalarca ekleme
                    if(this.deviceList.length > 0){
                        for(var i = 0; i <= this.deviceList.length; i++){
                            try { if(this.deviceList[i].name == device.name){ move_on = 0; } }
                            catch (error) {}
                        }
                    }
                    if(move_on == 1){
                        this.deviceList.push(device);
                            this.setState({});
                    }
                }
            }
        });
    }

    uniq(a, param){
        return a.filter(function(item, pos, array){
            return array.map(function(mapItem){ return mapItem[param]; }).indexOf(item[param]) === pos;
        })
    }

    // C3
    examine(){
        // Remove duplicates
        this.deviceList = this.uniq(this.deviceList, 'name');
        
        if(this.deviceList.length > 0){
            clearInterval(this.interval);
            this.showDeviceList();
            // this.connect(this.deviceList[0]);
        }
    }

    
    // C4
    connect = (device) => {

        this.bluetoothStop();
        this.setConnectionIndicator(device.name, true);
        
        // console.warn('Start Connecting')
        device.connect({timeout: 5000, autoConnect: false, requestMTU: 512})
            .then((device) => {
                // console.warn('Discover')
                return device.discoverAllServicesAndCharacteristics();
            })
            .then((device) => {
                // console.warn('Connected')
                this.manager.isDeviceConnected(device.id).then(d => {

                    console.log("MTU: ", device.mtu)

                    this.device = device; // for _stopExperiment

                    // *** EVENTS ***

                    // Set Disconnect Listener
                    this.manager.onDeviceDisconnected(device.id, (error, device) => {
                        console.warn('Disconnect Monitor')
                        this.props.disconnectDevice();
                    })

                    var bleDevice = {
                        device: device,
                        manager: this.manager,
                        name: device.name,
                    }

                    this.props.connectDevice(bleDevice);
                    this.moveOn(device);

                });
            })
            .catch((error) => {
                // console.error(error);
                this.dropDownAlertRef.alertWithType('error', 'Error', "Could not connect to device. Please try again.");
                setTimeout(() => {
                    this.checkPermission();
                }, 1000);
            });
    }

    moveOn = (device) => {
        this.props.navigation.replace('Monitor')
    }


    // UI Functions

    showAlertBox = () => {
        console.warn('show')
        if(this.state.isAlertShows == false){
            setTimeout(() => {
                this._alertbox.fadeInDown().then(() => { this.setState({isAlertShows: true}); });
            }, 200)
        }
    }

    hideAlertBox = () => {
        if(this.state.isAlertShows == true){
            setTimeout(() => {
                this._alertbox.fadeOutUp().then(() => {
                    this.setState({isAlertShows: false});
                    this.errorText = '';
                });
            }, 200)
        }
    }

    showDeviceList = () => {
        if(this.isListShows == false){
            this.isListShows = true;
            if(this._bluetooth_icon != null){
                return this._bluetooth_icon.animate({ 0: { scale: 1, height: 300 }, 1: { scale: 0.5, height: 100 } })
                    .then(() => {
                        if(this._list_devices != null){
                            this._list_devices.fadeInUp(200)
                        }
                    })
            }else{
                const nullPromise = new Promise((resolve) => {
                    resolve();
                })
                return nullPromise;
            }
        }
    }

    hideDeviceList = () => {
        if(this.isListShows == true){
            this.isListShows = false;
            if(this._list_devices != null){
                return this._list_devices.fadeOut(10)
                    .then(() => {
                        this._bluetooth_icon.animate({ 1: { scale: 1, height: 300 }, 0: { scale: 0.5, height: 100 } })
                    })
            }else{
                const nullPromise = new Promise((resolve) => {
                    resolve();
                })
                return nullPromise;    
            }
        }else{
            const nullPromise = new Promise((resolve) => {
                resolve();
            })
            return nullPromise;
        }
    }

    setConnectionIndicator = (name, option) => {
        for(var i = 0; i <= this.deviceList.length; i++){
            try {
                if(this.deviceList[i].name == name){
                    this.deviceList[i].connecting = option
                }
                this.setState({});
            }
            catch (error) {}
        }
    }

    listItemSelect = (device) => {
        if(this.connecting == false){
            this.connecting = true;
            this.connect(device);
        }
    }



    _renderList = (data) => {
        if(data.item.name != undefined){
            return(
                <Animatable.View delay={data.index ? ((data.index) * 1000) / 8  : 0} animation='fadeIn' useNativeDriver>
                    <TouchableOpacity onPress={() => {this.listItemSelect(data.item)}} style={styles.listItemContainer} activeOpacity={0.8}>
                        { data.item.connecting ? <ActivityIndicator style={{marginRight: 8}} color={colors.white} /> : null }
                        <Text style={styles.listItem}>{data.item.name}</Text>
                    </TouchableOpacity>
                </Animatable.View>
            )
        }
    }

    renderInfo = () => {
        return(
            <View style={{zIndex: 10, marginHorizontal: paddingScreen}}>
                <View style={{position: 'absolute', top: 0, right: 0, left: 0, height: 20, zIndex: 1, marginHorizontal: -paddingScreen}}>
                    <DropdownAlert updateStatusBar={false} ref={ref => this.dropDownAlertRef = ref} />
                </View>

                <Animatable.View style={{zIndex: 5, elevation: 5, opacity: 0}} ref={(c) => this._alertbox = c } duration={650}>
                    <AlertBox
                        text={this.errorText}
                        buttonText={!this.permissionStatus ? "Open Settings" : null}
                        onPress={() => openSettings().catch(() => console.error('cannot open settings')) }
                        />
                </Animatable.View>
            </View>
        )
    }

    render() {

        if(this.state.loading){
            return (
                <Container contentContainerStyle={{alignItems: 'center'}}>

                    {this.renderInfo()}

                    <View style={{ marginTop: 50, marginBottom: 100 }}>
                        <LottieView
                            source={require('../assets/animations/3721-bluetooth.json')}
                            style={{ width: 300 }}
                            autoPlay
                            loop />
                    </View>

                    <Animatable.View delay={100} animation='fadeInUp' useNativeDriver style={{paddingBottom: 100}}>

                        <Text style={{
                            fontFamily: 'Rubik-Bold',
                            fontSize: 20,
                            color: colors.white,
                            textAlign: 'center',
                            paddingHorizontal: 24,
                        }}>
                            Bağlanılıyor
                        </Text>

                    </Animatable.View>
                </Container>
            )
        }else{
            return (
                <Container contentContainerStyle={{flex: 1}}>
                    {this.renderInfo()}
                    
                    <SafeAreaView style={{flex: 1}}>
                        <Animatable.View style={styles.lottieContainer} ref={(c) => this._bluetooth_icon = c } duration={650}>
                            <LottieView source={require('../assets/animations/3721-bluetooth')} autoPlay loop style={styles.lottie} />
                        </Animatable.View>

                        <View style={styles.listContainer}>
                            <Animatable.View ref={(c) => this._list_devices = c} style={styles.listView} useNativeDriver={true}>
                                <FlatList
                                    data={this.deviceList}
                                    extraData={this.state}
                                    renderItem={this._renderList}
                                    keyExtractor={(item, index) => item.name} />
                            </Animatable.View>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>Please turn on your device</Text>
                        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Connect);