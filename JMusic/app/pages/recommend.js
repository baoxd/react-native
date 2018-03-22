import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import HttpMusic from '../api/api';
import Swiper from 'react-native-swiper';
import { jumpPage, width } from '../base/Utils';

const HTPPS_REG = /(?=\:)/g;

export default class Recommend extends Component {

    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.bgColor = '#222';
        this.HttpMusic = new HttpMusic();
        this.state = {
            decList: [],
            bannerData: {},
        }
    }

    componentDidMount() {
        this.requestData();
        this.requestDisc();
    }

    // 请求数据
    async requestData() {
        const data = await this.HttpMusic.getDiscUrl();
        if (data.code === 0) {
            this.setState({
                decList: data.data.list,
            });
        }
    }

    // 请求音乐
    async requestDisc() {
        const data = await this.HttpMusic.getBanner();
        if (data.code === 0) {
            this.setState({
                bannerData: data.data,
            });
        }
    }

    render() {
        const { bannerData, decList } = this.state;
        return (
            <View style={styles.container}>
                <ScrollView>
                    {
                        bannerData.slider && bannerData.slider.length &&
                        <View style={styles.swiper}>
                            <Swiper
                                height={200}
                                dot={<View 
                                    style={{
                                       backgroundColor: '#fff',
                                       width: 8,
                                       height: 8,
                                       borderRadius: 4,
                                       marginLeft: 3,
                                       marginRight: 3,
                                       marginTop: 3,
                                       marginBottom: 3,
                                    }}
                                />}
                                activeDot={<View
                                    style={{
                                        backgroundColor: 'hsla(0, 0%, 100%, .8)',
                                        width: 16,
                                        height: 8,
                                        borderRadius: 4,
                                        marginLeft: 3,
                                        marginRight: 3,
                                        marginTop: 3,
                                        marginBottom: 3,
                                    }}
                                />}
                                loop
                            >
                                {
                                    bannerData.slider.map((item, index) => {
                                        let imgUrl = item.picUrl.replace(HTPPS_REG, 's');
                                        return (
                                            <View key={`${index}_swiper`} style={styles.slide}>
                                                <Image source={{uri: imgUrl}} resizeMode="stretch" style={styles.image} />
                                            </View>
                                        )
                                    })
                                }
                            </Swiper>
                        </View>
                    }
                    <View style={styles.hotRecomment}>
                        <Text style={styles.hot}>热门推荐歌单</Text>
                    </View>

                    {
                        decList.length > 0 && <View style={styles.scrollListWrap} ref={(ref) => this._scrollList = ref}>
                            {
                                decList.map((item, index) => {
                                    let image = item.imgurl.replace(HTPPS_REG, 's');
                                    return (
                                        <TouchableOpacity
                                            key={`${index}_scrolllist`}
                                            onPress={() => {
                                                alert(1111);
                                            }}
                                        >
                                            <View style={styles.scrollList}>
                                                <Image source={{uri: image}} style={styles.scrollImg} />
                                                <View style={styles.scrollItemRight}>
                                                    <Text style={styles.itemName}>{item.creator.name}</Text>
                                                    <Text style={styles.itemDesc}>{item.dissname}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })
                            }
                        </View> 
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    continer: {
        flex: 1,
        backgroundColor: '#222222',
    },
    swiper: {
        width: width,
        height: 200,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    image: {
        width: width,
        height: 200,
        flex: 1,
    },
    hotRecomment: {
        height: 65,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hot: {
        fontSize: 16,
        color: '#ffcd32',
    },
    scrollListWrap: {
        flex: 1,
        width: width,
    },
    scrollList: {
        width: width,
        padding: 20,
        paddingTop: 0,
        flexDirection: 'row',
    },
    scrollImg: {
        width: 60,
        height: 60,
    },
    scrollItemRight: {
        flexDirection: 'column',
        flex: 1,
        marginLeft: 20,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 10,
    },
    itemDesc: {
        fontSize: 14,
        color: 'hsla(0, 0%, 100%, .3)',
    },
});