import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    StatusBar,
    SafeAreaView,
    ScrollView
} from 'react-native'

import colors from '../styles/colors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { paddingScreen } from '../styles/metrics';

export default class Container extends Component {

    constructor(props) {
		super(props);
	}

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle='light-content' backgroundColor={colors.softBlack} />
                
                {this.props.scroll ?
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={this.props.contentContainerStyle}
                    style={styles.contentContainer}
                    keyboardDismissMode='none'
                    keyboardShouldPersistTaps='handled'
                    >
                    {this.props.children}
                </KeyboardAwareScrollView>
                :
                <SafeAreaView style={[styles.container, this.props.style]}>
                    {this.props.children}
                </SafeAreaView>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        // backgroundColor: colors.black,
    },
    
    contentContainer: {
        flex: 1,
        paddingHorizontal: paddingScreen,
    },

})