import React from 'react';
import {
    View,
    TouchableOpacity,
    ActivityIndicator,
    Text,
    StyleSheet,
} from 'react-native';

import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';
import colors from '../styles/colors';


export default class ScreenLoading extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'space-evenly', alignItems: 'center'}}>

                <LottieView
                    source={require('../assets/animations/8714-light-bulb-loader.json')}
                    style={{ width: 120, height: 120 }}
                    autoPlay
                    loop />

                {this.props.text ?
                <Animatable.View delay={100} animation='fadeInUp' useNativeDriver>

                    <Text style={{
                        fontFamily: 'Avenir-Book',
                        fontSize: 20,
                        color: colors.white,
                        textAlign: 'center',
                        paddingHorizontal: 24,
                        lineHeight: 36,
                    }}>
                        {this.props.text}
                    </Text>

                </Animatable.View>
                : null}
            </View>
        );
    }
}


const styles = StyleSheet.create({

});
