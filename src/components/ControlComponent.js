import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'

import colors from '../styles/colors'
import { paddingScreen } from '../styles/metrics';

import Slider from "react-native-slider";
import SegmentedControl from '@react-native-community/segmented-control';
import { ColorPicker } from 'react-native-color-picker'

export default class ControlComponent extends Component {

    constructor(props) {
        super(props)
    }

    getText(){
        if(this.props.type == 'percent'){
            return parseInt(this.props.value * 100) + "%"
        }else if(this.props.type == 'degree'){
            return parseInt(this.props.value * 360) + "°"
        }
    }


    renderColorPicker(){
        return(
            <View style={{ flex: 1 }} pointerEvents={this.props.disabled ? 'none' : 'auto'}>
                <ColorPicker
                    onColorChange={color => {
                        this.props.onValueChange({ color: {
                            hue: color.h/360, // [0,360] => [0,1]
                            saturation: this.props.value.saturation,
                            value: this.props.value.value,
                        }})
                    }}
                    color={{
                        h: this.props.value.hue * 360, // [0,1] => [0, 360]
                        s: this.props.value.saturation,
                        v: this.props.value.value
                    }}
                    onColorSelected={() => this.props.onColorSelected()}
                    style={this.props.style}
                    hideSliders={true} />
            </View>
        )
    }


    renderSlider(){
        return(
            <Slider
                value={this.props.value}
                disabled={this.props.disabled}
                trackStyle={sliderStyle.track}
                thumbStyle={this.props.disabled ? sliderDisabledStyle.thumb : sliderStyle.thumb}
                maximumTrackTintColor={colors.softBlack}
                minumumTrackTintColor={colors.lightGray}
                animateTransitions={this.props.animation}
                animationType={'timing'}
                onValueChange={value => { this.props.onValueChange(value) }}
                />
        )
    }

    renderSegment(){
        return(
            <SegmentedControl
                values={this.props.values}
                enabled={!this.props.disabled}
                selectedIndex={this.props.value}
                appearance={'light'}
                backgroundColor={colors.softBlack}
                style={{ marginTop: paddingScreen / 3 }}
                fontStyle={{
                    fontFamily: 'Avenir-Book',
                    color: colors.white,
                    fontSize: 13,
                    fontWeight: 'normal'
                }}
                activeFontStyle={{
                    fontFamily: 'Avenir-Book',
                    color: colors.black,
                    fontSize: 13,
                    fontWeight: 'normal'
                }}
                tintColor={colors.white}
                onValueChange={(value) => {
                    if(this.props.value != this.props.values.indexOf(value)){
                        this.props.onValueChange(this.props.values.indexOf(value))
                        this.props.value = this.props.values.indexOf(value)
                    }
                }}
            />
        )
    }

    renderContent(){
        switch (this.props.type) {
            case 'percent':
                return this.renderSlider()

            case 'degree':
                return this.renderSlider()

            case 'segment':
                return this.renderSegment()

            case 'colorPicker':
                return this.renderColorPicker()
        
            default:
                break;
        }
    }
    
    render() {

        return (
            <View style={[styles.container, this.props.style]}>
                
                {this.props.text ? <View style={{flexDirection: 'row'}}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            fontFamily: "Avenir-Book",
                            fontSize: 13,
                            color: colors.white,
                            marginBottom: 4,
                        }}>{this.props.text}</Text>

                    </View>
                    
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        left: 0,
                        right: 0,
                    }}>
                        <Text style={{
                            fontFamily: "Avenir-Book",
                            fontSize: 13,
                            color: colors.white,
                            marginBottom: 4,
                        }}>{this.getText()}</Text>

                    </View>
                </View> : null}

                {this.renderContent()}
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    
    container: {
        marginHorizontal: paddingScreen,
        marginVertical: paddingScreen / 4,
    }

})

var sliderStyle = StyleSheet.create({

    track: {
        height: 6,
        borderRadius: 2,
    },
    
    thumb: {
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
        backgroundColor: 'white',
    }

});

var sliderDisabledStyle = StyleSheet.create({

    track: {
        height: 6,
        borderRadius: 2,
    },
    
    thumb: {
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
        backgroundColor: colors.gray,
    }

});