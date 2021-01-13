import React from 'react';
import {
    View,
    TouchableOpacity,
    ActivityIndicator,
    Text,
    StyleSheet,
} from 'react-native';

import colors from '../styles/colors';

export default class Button extends React.Component {
    
    constructor(props) {
        super(props);
    }


    renderText = () => {
        if(!this.props.loading){
            return(
                <Text style={
                    [
                        styles.text,
                        this.props.primary ? styles.textWhite : null,
                        this.props.secondary ? styles.textWhite : null,
                        this.props.discard ? styles.textWhite : null,
                        this.props.bordered ? styles.textBlue : null,
                        this.props.borderedDiscard ? styles.textDiscard : null,
                        this.props.purple ? styles.textWhite : null,
                    ]}>
                        {this.props.text}
                </Text>
            )
        }else{
            if(this.props.primary || this.props.secondary){
                return(
                    <ActivityIndicator color={'white'} />
                )
            }else{
                return(
                    <ActivityIndicator color={colors.gray} />
                )
            }
        }
    }


    render() {
        return (
            <TouchableOpacity style={
                [
                    styles.container, 
                    this.props.primary ? styles.backBlue : null,
                    this.props.secondary ? styles.backGray : null,
                    this.props.discard ? styles.backRed : null,
                    this.props.bordered ? styles.backWhite : null,
                    this.props.borderedDiscard ? styles.backDiscard : null,
                    this.props.purple ? styles.backPurple : null,
                    {...this.props.style}
                ]}
                onPress={this.props.onPress}
                activeOpacity={0.8}
                disabled={this.props.disabled}>
                
                {this.renderText()}

            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({

    container: {
        // width: '100%',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },

    backGray:{
        backgroundColor: colors.disabled,
        borderWidth: 1,
        borderColor: colors.disabled,
    },
    backBlue:{
        backgroundColor: colors.bluePrimary,
        borderWidth: 1,
        borderColor: colors.bluePrimary,
    },
    backRed:{
        backgroundColor: colors.red,
        borderWidth: 1,
        borderColor: colors.red,
    },
    backWhite:{
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.bluePrimary,
    },
    backPurple:{
        backgroundColor: colors.purple,
        borderWidth: 1,
        borderColor: colors.purple,
    },
    backDiscard:{
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.red,
    },

    text: {
        fontFamily: 'Rubik-Bold',
        fontSize: 16,
    },
    textBlue: {
        color: colors.bluePrimary,
    },
    textWhite: {
        color: colors.white,
    },
    textBlack: {
        color: 'black',
    },
    textDiscard: {
        color: colors.red,
    },

    icon:{
        width: 24,
        height: 24,
        position: 'absolute',
        left: 14,
        top: 14,
        bottom: 14,
    }

});
