import React, { Component } from 'react';
import {
    View,
    Platform,
} from 'react-native';

const height = Platform.OS === 'ios' ? 20 : 0;

export default class NavBarView extends Component {
    render() {
        return (
            <View style={{
                height: height,
                backgroundColor: this.props.backgroundColor,
            }}>
            </View>
        );
    }
};