import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    StatusBar,
    Dimensions,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Animated,
} from 'react-native';

import HttpMusic from '../api/api';
import { createSong } from '../common/song';
import { height, jumpPage, width, shuffle } from '../base/Utils'

const windowHeight = width * 0.7;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class RankDetail extends Component {
    

    render() {
        return null;
    }
}

