import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    StatusBar,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    FlatList,
    ScrollView,
} from 'react-native';

import HttpMusic from '../api/api';
import isValidMusic, { createSong } from '../common/song';
import { width, height, jumpPage } from '../base/Utils';

const perpage = 20;
const TYPE_SINGER = 'singer';

export default class Search extends Component {
    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            hotData: [],
            result: [],
            txtValue: '',
            page: 1,
            hasMore: true,
            showSinger: true,
        };
        this.HttpMusic = new HttpMusic();
        this.getHotSearch();
    }

    async getHotSearch() {
        const data = await this.HttpMusic.getHot();
        if (data && data.code === 0) {
            this.setState({
                hotData: data.data.hotkey.slice(0, 10)
            });
        }
    }

    changeText(text) {
        this.setState({
            page: 1,
            txtValue: text,
        }, () => {
            this.HttpMusic.getSearch(
                this.state.txtValue,
                this.state.page,
                this.state.showSinger,
                perpage
            ).then((data) => {
                if (data && data.code === 0) {
                    let result = this.state.result.concat(this._genResult(data.data));
                    this.setState({
                        result: result,
                    });
                    this._checkMore(data.data);
                }
            });
        })
    }

    _genResult(data) {
        let ret = [];
        if (data.zhida && data.zhida.singerid && this.state.page === 1) {
            ret.push({ ...data.zhida, ...{ type: TYPE_SINGER }});
        }
        if (data.song) {
            ret = ret.concat(this._normalizeSongs(data.song.list));
        }
        return ret;
    }

    _checkMore(data) {
        const song = data.song;
        if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
            this.setState({
                hasMore: false,
            });
        }
    }

    _normalizeSongs(list) {
        let ret = [];
        list.forEach((musicData) => {
            ret.push(createSong(musicData));
        });
        return ret;
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentWrapper}>
                    <View style={styles.InputWrapper}>
                        <Image source={require('./img/icon_search.png')} style={styles.icon_search}/>
                        <TextInput
                            style={styles.textInputStyle}
                            placeholder={`搜索歌曲、歌手`}
                            placeholderTextColor={`hsla(0, 0%, 100%, .3)`}
                            autoFocus={true}
                            onChangeText={(text) => {
                                this.changeText(text);
                            }}
                            value={this.state.txtValue}
                        />
                    </View>
                </View>

                <View style={styles.hotWrap}>
                    <Text style={styles.hot_title}>热门搜索</Text>
                    <View style={styles.hotTitleWrap}>
                        {
                            this.state.hotData.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.changeText(item.k)
                                        }}
                                        key={`hottitle_${index}`}
                                    >
                                        <View style={styles.name_tab}>
                                            <Text ref='title' style={styles.name}>{item.k}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
    },
    contentWrapper: {
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    InputWrapper: {
        width: width - 40,
        marginTop: 20,
        marginBottom: 20,
        paddingLeft: 6,
        paddingRight: 6,
        height: 40,
        backgroundColor: '#333',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 3,
    },
    icon_search: {
        width: 23,
        height: 23,
    },
    textInputStyle: {
        paddingLeft: 6,
        paddingRight: 6,
        flex: 1,
        height: 20,
        color: '#fff',
    },
    hotWrap: {
        flex: 1,
        position: 'relative',
        width: width,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 20,
        marginTop: 0,
    },
    hot_title: {
        fontSize: 14,
        marginBottom: 20,
        color: 'hsla(0,0%,100%,.5)'
    },
    hotTitleWrap: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    name_tab: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#333',
        marginBottom: 10,
        marginRight: 15,
        borderRadius: 3,
    },
    name: {
        fontSize: 14,
        color: 'hsla(0, 0%, 100%, .3)',
    }
});




