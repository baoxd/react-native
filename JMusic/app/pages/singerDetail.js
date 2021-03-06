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
import { width, height, jumpPage, shuffle } from '../base/Utils';

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
        if (data.code === 0) {
            this._normalistSong(data.cdlist[0].songlist.slice(0, 99));
        }
    }

    async requestData() {
        const data = await this.HttpMusic.getDetailSinger(this.mid);
        if (data.code === 0) {
            this._normalistSongs(data.data.list);
        }
    }

    _normalistSong(list) {
        let ret = [];
        list.forEach((musicData) => {
            ret.push(createSong(musicData));
        });
        this.setState({
            singerData: ret,
        });
    }

    _normalistSongs(list) {
        let ret = [];
        list.forEach((item) => {
            let { musicData } = item;
            if (isValidMusic(musicData)) {
                ret.push(createSong(musicData));
            }
        });
        this.setState({
            singerData: ret,
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => {this.props.navigation.goBack()}} style={styles.back}>
                    <Image style={{width: 26, height: 26}} source={require('./img/icon_back.png')} />
                </TouchableOpacity>
                <View style={styles.titleWrap}>
                    <Text style={styles.title} numberOfLines={1}>{this.props.navigation.state.params.data.title}</Text>
                </View>
                {
                    this.state.singerData.length > 0 && 
                    <Animated.View style={{
                        position: 'relative',
                        width: width, 
                        paddingTop: windowHeight,
                        opacity: this.state.scrollY.interpolate({
                            inputRange: [-windowHeight, 0, windowHeight / 1.2],
                            outputRange: [1, 1, 0.4],
                            extrapolate: 'clamp',
                        }),
                        transform: [{
                            translateY: this.state.scrollY.interpolate({
                                inputRange: [-windowHeight, 0, windowHeight],
                                outputRange: [windowHeight / 2, 0, -50 ],
                                extrapolate: 'clamp'
                            })
                        }, {
                            scale: this.state.scrollY.interpolate({
                                inputRange: [-windowHeight, 0, windowHeight],
                                outputRange: [2, 1, 1],
                            })
                        }],
                    }}>
                        <Image 
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                resizeMode: 'cover',
                                width: width,
                                height: windowHeight,
                            }}
                            source={{uri: this.avatar}}
                        />
                        <TouchableOpacity
                            style={styles.playWrapper}
                            onPress={() => {
                                jumpPage(this.props.navigation.navigate, 'Play', {
                                    songs: shuffle(this.state.singerData)
                                })
                            }}
                        >
                            <Image source={require('./img/icon-play.png')} style={styles.iconPlay}/>
                        </TouchableOpacity>
                        <View style={styles.filter} />
                    </Animated.View>
                }
                <Animated.View
                    style={{
                        flex: 1,
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        top: windowHeight - 50,
                        height: height,
                        zIndex: 99,
                        paddingTop: 20,
                        paddingLeft: 30,
                        paddingRight: 30,
                        backgroundColor: '#222',
                        transform: [{
                            translateY: this.state.scrollY.interpolate({
                                inputRange: [-windowHeight, 0, windowHeight],
                                outputRange: [windowHeight - 50, 0, -windowHeight + 110],
                                extrapolate: 'clamp',
                            })
                        }],
                    }}
                >
                    {
                        this.state.singerData.length > 0 &&
                        <AnimatedFlatList
                            data={this.state.singerData}
                            keyExtractor={(item, index) => index}
                            showsVerticalScrollIndicator={false}
                            scrollEventThrottle={26}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: this.state.scrollY }}}],
                                { useNativeDriver: true }
                            )}
                            renderItem={({item, index}) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            jumpPage(this.props.navigation.navigate, 'Play', {
                                                songs: this.state.singerData,
                                                currentIndex: index,
                                            })
                                        }}
                                    >
                                        <View
                                            style={styles.listGroup}
                                        >
                                            <Text numberOfLines={1} style={styles.singer_name}>{item.name}</Text>
                                            <Text numberOfLines={1} style={styles.singer_album}>{item.singer}-{item.album}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        >
                        </AnimatedFlatList>
                    }
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    back: {
        position: 'absolute',
        top: 25,
        left: 10,
        zIndex: 10,
    },
    titleWrap: {
        flex: 1,
        width: 0.8 * width,
        height:50,
        left: 0.1 * width,
        marginTop: 10,
        position: 'absolute',
        justifyContent: 'center',
        zIndex: 101,
        backgroundColor: 'transparent', 
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        color: '#fff',
    },
    playWrapper: {
        position: 'absolute',
        bottom: 70,
        left: 0,
        width: width,
        height: 32,
        zIndex: 10,
        alignItems: 'center',
    },
    iconPlay: {
        height: 32,
        width: 135,
    },
    filter: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        width: width,
        height: windowHeight,
        backgroundColor: 'rgba(7, 17, 27, 0.4)',
    },
    listGroup: {
        height: 64,
        flex: 1,
        justifyContent: 'center',
    },
    singer_name: {
        fontSize: 14,
        color: '#fff',
    },
    singer_album: {
        fontSize: 14,
        marginTop: 5,
        color: 'hsla(0, 0%, 100%, .3)'
    }
});
