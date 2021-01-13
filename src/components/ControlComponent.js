import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../styles/colors'
import { paddingScreen } from '../styles/metrics';

import Slider from "react-native-slider";
import SegmentedControl from '@react-native-community/segmented-control';

export default class ControlComponent extends Component {

    constructor(props) {
        super(props)
        this.value = this.props.value
    }

    componentDidUpdate(){
        this.value = this.props.value
    }

    getText(){
        if(this.props.type == 'percent'){
            return parseInt(this.value * 100) + "%"
        }else if(this.props.type == 'degree'){
            return parseInt(this.value * 360) + "°"
        }
    }


    renderSlider(){
        return(
            <Slider
                value={this.value}
                trackStyle={sliderStyle.track}
                thumbStyle={sliderStyle.thumb}
                maximumTrackTintColor={colors.softBlack}
                minumumTrackTintColor={colors.lightGray}
                onValueChange={value => {
                    this.props.onValueChange(value)
                    this.value = value
                }}
                />
        )
    }

    renderSegment(){
        return(
            <SegmentedControl
                values={this.props.values}
                selectedIndex={this.value}
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
                onChange={(event) => {
                    this.props.onValueChange(event.nativeEvent.selectedSegmentIndex)
                    this.value = event.nativeEvent.selectedSegmentIndex
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
        // borderColor: '#30a935',
        // borderWidth: 2,
    }
    
});