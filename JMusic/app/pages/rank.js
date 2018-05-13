import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native';

import HttpMusic from '../api/api';
import { jumpPage, width } from '../base/Utils';

export default class Rank extends Component {
    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            rankSource: [],
        }
        this.bgColor = '#222';
        this.HttpMusic = new HttpMusic();
        this.requestData();
    }

    async requestData() {
        const data = await this.HttpMusic.getRank();
        if (data && data.code === 0) {
            this.setState({
                rankSource: data.data.topList
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    {
                        this.state.rankSource.length > 0 && 
                        <FlatList
                            data={this.state.rankSource}
                            keyExtractor={(item, index) => index}
                            showsVerticalScrollIndicator={false}
                            renderItem={({item, index}) => {
                                let reg = /(?=\:)/g;
                                let imgUrl = item.picUrl.replace(reg, 's');
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            jumpPage(this.props.navigate, 'RankDetail', {
                                                id: item.id
                                            })
                                        }}
                                    >
                                        <View style={styles.rankGroup}>
                                            <Image source={{uri: imgUrl}} style={styles.img}/>
                                            <View style={styles.textWrap}>
                                                {
                                                    item.songList.map((song, i) => {
                                                        return (
                                                            <View style={styles.innerText} key={i}>
                                                                <Text style={styles.text}>{`${i + 1} ${song.songname}${song.singername}`}</Text>
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        >

                        </FlatList>
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222',
    },
    wrapper: {
        flex: 1,
        width: width,
        paddingLeft: 20,
        paddingRight: 20,
    },
    rankGroup: {
        height: 100,
        marginTop: 20,
        flexDirection: 'row',
    },
    img: {
        height: 100,
        width: 100,
    },
    textWrap: {
        paddingLeft: 20,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#333',
    },
    innerText: {
        height: 26,
        justifyContent: 'center',
    },
    text: {
        fontSize: 12,
        color: 'hsla(0, 0%, 100%, .3)',
    }
});
