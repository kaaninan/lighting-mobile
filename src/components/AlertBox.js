import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import * as Animatable from 'react-native-animatable';

import colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Button extends React.Component {
    
    constructor(props) {
        super(props);
        this.navigation = this.props.navigation;
    }


    render() {
        if(!this.props.static){
            return (
                <View style={styles.container}>
                    <View style={styles.main}>
                        <Icon name={'ios-information-circle-outline'} size={35} style={styles.icon} />
                        <Text style={styles.text}>{this.props.text}</Text>
                        {this.props.buttonText ? 
                            <TouchableOpacity style={styles.button} onPress={this.props.onPress}>
                                <Text style={styles.buttonText}>{this.props.buttonText}</Text>
                            </TouchableOpacity>
                            :
                            <View></View>
                        }
                    </View>
                </View>
            );
        }else{
            return (
                <View style={styles.containerStatic}>
                    <View style={[styles.mainStatic, this.props.style]}>
                        <Icon name={'ios-information-circle-outline'} size={35} style={styles.icon} />
                        <Text style={styles.text}>{this.props.text}</Text>
                        {this.props.buttonText ? 
                            <TouchableOpacity style={styles.button} onPress={this.props.onPress}>
                                <Text style={styles.buttonText}>{this.props.buttonText}</Text>
                            </TouchableOpacity>
                            :
                            <View></View>
                        }
                    </View>
                </View>
            );
        }
    }
}


const styles = StyleSheet.create({

    // Static

    containerStatic: {
        width: '100%',
    },

    mainStatic: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        // margin: 24,
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },


    // Non Static

    container: {
        position: 'absolute',
        width: '100%',
        elevation: 10,
        zIndex: 10,
    },

    main: {
        marginTop: 24,
        backgroundColor: colors.softBlack,
        justifyContent: 'center',
        alignItems: 'center',
        // margin: 24,
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 12,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    
    icon: {
        color: colors.white,
        marginBottom: 10,
    },

    text: {
        fontFamily: 'Avenir-Book',
        fontSize: 15,
        color: colors.white,
        lineHeight: 22,
        textAlign: 'center',
    },

    button: {
        // position: 'absolute',
        width: '100%',
        paddingTop: 16,
        paddingHorizontal: 64,
    },

    buttonText: {
        fontFamily: 'Avenir-Book',
        fontSize: 15,
        color: colors.bluePrimary,
        lineHeight: 22,
        textAlign: 'center',  
    },

});
