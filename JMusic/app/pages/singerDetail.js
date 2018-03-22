import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Animated
} from 'react-native';

import HttpMusic from '../api/api';
import { createSong, isValidMusic } from '../common/song';
import { width, height, jumpPager, shuffle } from '../base/Utils';

const windowHeight = width * 0.7;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class SingerDetail extends Component {
    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
            singerData:[],
        }
        this.HttpMusic = new HttpMusic();
        let { data } = this.props.navigation.state.params;
        this.title = data.name;
        this.avatar = data.avatar;
        this.mid = data.id;
        this.page = data.page;
    }

    componentWillMount() {
        if (this.page === 'Recommend') {
            this.getSongData();
        } else {
            this.requestData();
        }
    }

    async getSongData() {
        const data = await this.HttpMusic.getSongList(this.mid);
        console.log(data);
    }

    async requestData() {
        const data = await this.HttpMusic.getDetailSinger(this.mid);
        console.log(data);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>12312313</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
