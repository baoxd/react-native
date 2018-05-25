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
    Platform,
    Slider,
    ActivityIndicator,
    Easing,
} from 'react-native';
import Video from 'react-native-video';
import HttpMusic from '../../api/api';
import BlurImage from 'react-native-blur-image';
import { width, height, jumpPage } from '../../base/Utils';
import HttpSong from '../../api/song';

let Buffer = require('buffer').Buffer;
// 存放歌词
let lyrObj = [];
let myAnimate;

export default class Play extends Component {

    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.navigate = this.props.navigation.state.params.data;
        this.spinValue = new Animated.Value(0);
        this.state = {
            songs: [], //歌曲id数据源
            playModel: 1, // 播放模式 1：列表循环 2：随机 3：单曲循环
            btnModel: require('../img/icon_mode.png'), // 播放模式按钮背景图
            pic_small: '', // 小图
            pic_big: '', //大图
            file_duration: '', //歌曲长度
            song_id: '', //歌曲id
            title: '',   //歌曲名字
            author: '',  //作者
            file_link: '', //歌曲播放链接
            songLyr: [], //当前歌词
            sliderValue: 0, //Slide的value
            pause: false, //播放、暂停
            currentTime: 0.0, //当前时间
            duration: 0.0, //歌曲时间
            currentIndex: 0, //当前第几首
            isplayBtn: require('../img/icon_pause.png'), //播放、暂停按钮背景图
            imgRotate: new Animated.Value(0),
            currentShow: 'cd',
        }
        this.isGoing = false; //是否旋转
        this.myAnimate = Animated.timing(this.state.imgRotate, {
            toValue: 1,
            duration: 6000,
            easing: Easing.inOut(Easing.linear),
        });
        this.HttpMusic = new HttpMusic();
        this.bgColor = '#222';
    }

    componentDidMount() {
        let currentIndex = this.navigate.currentIndex ? this.navigate.currentIndex : 0;
        this.stop();
        this.loadSongInfo(currentIndex);
    }

    imgMoving = () => {
        if (this.isGoing) {
            this.state.imgRotate.setValue(0);
            this.myAnimate.start(() => {
                this.imgMoving();
            })
        }
    }

    stop = () => {
        this.isGoing = !this.isGoing;
        
        if (this.isGoing) {
            this.myAnimate.start(() => {
                this.myAnimate = Animated.timing(this.state.imgRotate, {
                    toValue: 1,
                    duration: 6000,
                    easing: Easing.inOut(Easing.linear),
                });
                this.imgMoving();
            })
        } else {
            this.state.imgRotate.stopAnimation((oneTimeRotate) => {
                this.myAnimate = Animated.timing(this.state.imgRotate, {
                    toValue: 1,
                    duration: (1 - oneTimeRotate) * 6000,
                    easing: Easing.inOut(Easing.linear),
                })
            });
        }
    }

    loadSongInfo(index) {
        let reg = /(?=\:)/g;
        let song = this.navigate.songs[index];

        this._getLyric(song.mid);

        this.setState({
            pic_small: song.image,
            pic_big: song.image,
            title: song.name,
            author: song.singer,
            file_link: song.url.replace(reg, 's'),
            file_duration: song.duration, //歌曲长度
        });
    }

    // 获取歌词
    async _getLyric(mid) {
        const data = await this.HttpMusic.getLyric(mid);

        if (data && data.code === 0) {
            let lry = new Buffer(data.lyric, 'base64');
            let lryAry = lry.toString().split('\n');
            lryAry.forEach((val, index) => {
                var obj = {}   //用于存放时间
                val = val.replace(/(^\s*)|(\s*$)/g, '')
                let indeofLastTime = val.indexOf(']')  // ]的下标
                let timeStr = val.substring(1, indeofLastTime) //把时间切出来 0:04.19
                let minSec = ''
                let timeMsIndex = timeStr.indexOf('.')  // .的下标
                if (timeMsIndex !== -1) {
                    //存在毫秒 0:04.19
                    minSec = timeStr.substring(1, val.indexOf('.'))  // 0:04.
                    obj.ms = parseInt(timeStr.substring(timeMsIndex + 1, indeofLastTime))  //毫秒值 19
                } 
                else {
                    //不存在毫秒 0:04
                    minSec = timeStr
                    obj.ms = 0
                }
                let curTime = minSec.split(':')  // [0,04]
                obj.min = parseInt(curTime[0])   //分钟 0
                obj.sec = parseInt(curTime[1])   //秒钟 04
                obj.txt = val.substring(indeofLastTime + 1, val.length) //歌词文本: 留下唇印的嘴
                obj.txt = obj.txt.replace(/(^\s*)|(\s*$)/g, '')
                obj.dis = false
                obj.total = obj.min * 60 + obj.sec + obj.ms / 100   //总时间

                if (obj.txt.length > 0) {
                    lyrObj.push(obj)
                }
            })
        }
    }

    // 播放模式
    playModel = (playModel) => {
        playModel++;
        playModel = playModel === 4 ? 1 : playModel;

        this.setState({
            playModel: playModel,
        });
        if (playModel === 1) {
            this.setState({
                btnModel: require('../img/icon_mode.png'),
            });
        } else if (playModel === 2) {
            this.setState({
                btnModel: require('../img/icon-random.png'),
            });
        } else {
            this.setState({
                btnModel: require('../img/icon_loop.png'),
            });
        }
    }

    // 把秒数转换为时间类型
    formatTime(time) {
        let min = Math.floor(time / 60);
        let second = time - min * 60;
        min = min >= 10 ? min : '0' + min;
        second = second >= 10 ? second : '0' + second;
        return min + ':' + second;
    }

    // 播放器每隔250ms调用一次
    onProgress = (data) => {
        let val = parseInt(data.currentTime);
        this.setState({
            sliderValue: val,
            currentTime: data.currentTime,
        });
        // 如果当前歌曲播放完毕，需要开始下一首
        if (val === this.state.file_duration) {
            if (this.state.playModel === 1) {
                this.nextAction(this.state.currentIndex + 1);
            } else if (this.state.playModel === 2) {
                let last = this.navigate.songs.length;
                let random = Math.floor(Math.random() * last);
                this.nextAction(random);
            } else {
                this.video.seek(0);
                this._scrollView.scrollTo({
                    x: 0,
                    y: 0,
                    animated: false,
                });
            }
        }
    }

    // 上一曲
    prevAction = (index) => {
        this.recover();
        lyrObj = [];
        if (index === -1) {
            index = this.navigate.songs.length - 1;
        }
        this.setState({
            currentIndex: index,
        });
        this.loadSongInfo(index);
    }

    // 播放暂停
    playAction = () => {
        this.stop();
        this.setState({
            pause: !this.state.pause,
        });
        if (this.state.pause === true) {
            this.setState({
                isplayBtn: require('../img/icon_pause.png'),
            });
        } else {
            this.setState({
                isplayBtn: require('../img/icon_play.png'),
            });
        }
    }

    // 下一曲
    nextAction = (index) => {
        this.recover();
        lyrObj = [];
        if (index === this.state.songs.length) {
            index = 0;
        }
        this.setState({
            currentIndex: index,
        });
        this.loadSongInfo(index);
    }

    // 旋转动画
    spin() {
        this.spinValue.setValue(0);
        myAnimate = Animated.timing(this.spinValue, {
            toValue: 1,
            duration: 4000,
            easing: Easing.linear,
        }).start(() => this.spin())
    }

    // 换歌时恢复进度条和起始时间
    recover = () => {
        this.setState({
            sliderValue: 0,
            currentTime: 0.0,
        });
    }

    // 播放器加载好时调用，其中有一些信息带过来
    onLoad = (data) => {
        this.setState({
            duration: data.duration,
        });
    }

    _onScroll(event) {
        let { contentOffset } = event.nativeEvent;

        if (contentOffset.x >= width) {
            this.setState({
                currentShow: 'lyric'
            });
        } else {
            this.setState({
                currentShow: 'cd',
            });
        }
    }

    _renderCurrentText() {
        let itemAry = [];
        for (let i = 0 ; i < lyrObj.length; i++) {
            let item = lyrObj[i].txt;
            if (lyrObj[i+1] && this.state.currentTime.toFixed(2) > lyrObj[i].total && this.state.currentTime.toFixed(2) < lyrObj[i+1].total) {
                itemAry.push(
                    <View key={i} style={styles.songWrapper}>
                        <Text style={styles.currentText} numberOfLines={1}>{item}</Text>
                    </View>
                );
            }
        }
        return itemAry;
    }

    renderItem() {
        // 数组
        var itemAry = [];
        for (var i = 0; i < lyrObj.length; i++) {
          var item = lyrObj[i].txt
          if (this.state.currentTime.toFixed(2) > lyrObj[i].total) {
            //正在唱的歌词
            if(lyrObj[i+1] && lyrObj[i+1].total && lyrObj[i+1].total < this.state.currentTime.toFixed(2)) {
              itemAry.push(
                <View key={i} style={styles.itemStyle}>
                  <Text style={{ color: 'hsla(0,0%,100%,.5)', fontSize: 14 }}> {item} </Text>
                </View>
              );
            } else {
              itemAry.push(
                <View key={i} style={styles.itemStyle}>
                  <Text style={{ color: 'white', fontSize: 16 }}> {item} </Text>
                </View>
              );
            }
          } else {
            //所有歌词
            itemAry.push(
              <View key={i} style={styles.itemStyle}>
                <Text style={{ color: 'hsla(0,0%,100%,.5)', fontSize: 14 }}> {item} </Text>
              </View>
            )
          }
        }
        return itemAry;
      }

    render() {
        if (this.state.file_link.length <= 0) {
            return (
                <ActivityIndicator
                    animating={this.state.animating}
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    size="large"
                />
            )
        } else {
            const spin = this.spinValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
            });

            console.log(1111111);
            console.log(this.state.file_link);
            return (
                <View style={styles.container}>
                    <BlurImage
                        source={{uri: this.state.pic_big}}
                        style={{flex: 1}}
                        blurRadius={50}
                    />

                    {/* 作者-歌名 */}
                    <View style={styles.title_wrapper}>
                        <Text numberOfLines={1} style={{color: '#fff', fontSize: 18, marginBottom: 10}}>{this.state.author}</Text>
                        <Text numberOfLines={1} style={{color: '#fff', fontSize: 14,}}>{this.state.title}</Text>
                    </View>
                    <ScrollView
                        style={styles.scrollView}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled={true}
                        scrollEventThrottle={20}
                        onScroll={(e) => {
                            this._onScroll(e);
                        }}
                    >
                        <View style={styles.playWrapper}>
                            <View>
                                {/* 胶片光盘 */}
                                <Image source={require('../img/胶片盘.png')}
                                    style={{
                                        width: 260, height: 260, alignSelf: 'center',
                                    }}
                                />
                                {/* 旋转小图 */}
                                <Animated.Image
                                    ref="myAnimate"
                                    style={{
                                        width: 210,
                                        height: 210,
                                        marginTop: -235,
                                        alignSelf: 'center',
                                        borderRadius: 210 * 0.5,
                                        transform: [{
                                            rotate: this.state.imgRotate.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0deg', '360deg'],
                                            })
                                        }],
                                    }}
                                    source={{uri: this.state.pic_small}}
                                />
                            </View>
                            {this._renderCurrentText()}
                        </View>
                        <View
                            style={{
                                width: width,
                                flex: 1,
                                alignItems: 'center',
                                paddingBottom: 46,
                            }}
                        >
                            <ScrollView
                                style={{
                                    position: 'absolute',
                                }}
                                showsHorizontalScrollIndicator={false}
                                ref={(scrollView) => {
                                    this._scrollView = scrollView;
                                }}
                            >
                                {this.renderItem()}
                            </ScrollView>
                        </View>
                    </ScrollView>

                    {/* 播放器 */}
                    {
                        this.state.file_link && this.state.file_link.length > 0 &&
                        <Video
                            source={{uri: this.state.file_link}}
                            ref={(ref) => {this.video = ref}}
                            rate={1.0}
                            volume={1.0}
                            muted={false}
                            paused={this.state.pause}
                            onProgress={(e) => this.onProgress(e)}
                            onLoad={(e) => this.onLoad(e)}
                        />
                    }
                    <View style={style.progress}>
                        
                    </View>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title_wrapper: {
        position: 'absolute',
        top: 30,
        width: width,
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginBottom: 25,
    },
    scrollView: {
        position: 'absolute',
        top: 90,
        bottom: 170,
    },
    playWrapper: {
        width: width,
        flex: 1,
    },
    songWrapper: {
        marginTop: 70,
        width: width,
        alignItems: 'center',
        borderColor: 'red',
        borderWidth: 1,
    },
    currentText: {
        fontSize: 16,
        width: width * 0.8,
        textAlign: 'center',
        color: 'hsla(0, 0%, 100%, .5)'
    },
    itemStyle: {
        height: 32,
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        alignItems: 'center',
    },
});
