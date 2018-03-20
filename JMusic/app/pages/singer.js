import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';

import HttpMusic from '../api/api';
import { LargeList } from 'react-native-largelist';
import singer from '../common/singer.js';
import { width, height, jumpPager } from '../base/Utils';

const HOT_SINGER_LEN = 10;
const HOT_NAME = '热门';
const TITLE_HEIGHT = 60;
const LIST_HEIGHT = 80;

export default class Singer extends Component {
    selectedIndex: number = 0;
    listRef: LargeList;
    indexes: LargeList;

    constructor(props) {
        super(props);
        this.state = {
            SingerList: [],
            singerData: [],
            activeIndex: 0,
        }
        this.HttpMusic = new HttpMusic();
        this.listHeight = [];
        this.getSinger();
    }

    async getSinger() {
        const data = await this.HttpMusic.getSinger();
        console.log(data);
        if (data.code === 0) {
            this.setState({
                singerData: data.data.list,
            }, () => {
                this._normalizeSinger(this.state.singerData);
            });
        }        
    }
    
    // 处理歌手数据
    _normalizeSinger(list) {
        let map = {
            hot: {
                title: HOT_NAME,
                items: [],
            }
        }

        list.forEach((v, i) => {
            if (i < HOT_SINGER_LEN) {
                map.hot.items.push(new singer({
                    id: v.Fsinger_mid,
                    name: v.Fsinger_name,
                }));
            }
            const key = v.Findex;
            if (!map[key]) {
                map[key] = {
                    title: key,
                    items: [],
                }
            }
            map[key].items.push(new singer({
                id: v.Fsinger_mid,
                name: v.Fsinger_name,
            }));
        });
        let ret = [];
        let hot = [];
        let maxArr = [];

        for(let key in map) {
            let val = map[key];
            if (val.title.match(/[a-zA-Z]/)) {
                ret.push(val);
            } else if (val.title === HOT_NAME) {
                hot.push(val);
            }
        }
        ret.sort((a, b) => {
            return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });
        let retList = hot.concat(ret);
        for (let i = 0; i < retList.length; i++) {
            retList[i].height = retList[i].items.length * LIST_HEIGHT + TITLE_HEIGHT;
        }
        retList[0].selected = true;
        this.setState({
            SingerList: retList,
        });
    }

    renderSection(section: number) {
        const { SingerList } = this.state;
        return (
            <View style={{flex:1, backgroundColor: '#333', justifyContent: 'center'}}>
                <Text style={{fontSize: 14, color: 'hsla(0, 0%, 100%,.5)', marginLeft: 20}}>
                    {SingerList[section].title}
                </Text>
            </View>
        );
    }

    renderItem(section: number, row: number) {
        const { SingerList } = this.state;
        const singer = SingerList[section].items[row];
        return (
            <TouchableOpacity
                style={{flex: 1}}
            >
                <View style={{flex:1, flexDirection: 'row', paddingLeft: 20, alignItems: 'center'}}>
                    <Image source={{uri: singer.avatar}} style={{width: 50, height: 50, borderRadius: 25, marginRight: 20}} />
                    <Text style={{color: 'hsla(0, 0%, 100%, .5)'}}>
                        {singer.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    onSectionChange(section: number) {
        this.state.SingerList[this.selectedIndex].selected = false;
        this.state.SingerList[section].selected = true;
        // 使用局部刷新
        this.indexes.reloadIndexPaths([
            { section: 0, row: this.selectedIndex},
            { section: 0, row: section},
        ]);
        this.selectedIndex = section;

        let bFind = false;
        this.indexes.visibleIndexPaths().forEach(indexPath => {
            if (indexPath.row === section) {
                bFind = true;
            }
        });
        if (!bFind) {
            this.indexes.scrollToIndexPath({section: 0, row: section});
        }
    }

    renderIndexes(section: number, row: number) {
        const { SingerList } = this.state;
        let selected = SingerList[row].selected;

        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                onPress={() => {
                    this.listRef.scrollToIndexPath({ section: row, row: 0});
                }}
            >
                <Text style={{fontSize: 12, color: selected ? "#ffcd32" : "hsla(0, 0%, 100%, .5)"}}>
                    {SingerList[row].title.substr(0, 1)}
                </Text>
            </TouchableOpacity>
        );
    }

    render() {
        const { SingerList } = this.state;
        return (
            <View style={styles.container}>
                {SingerList && SingerList.length > 0 && <LargeList
                    ref={ref => this.listRef = ref}
                    style={{flex: 1, backgroundColor: '#222'}}
                    numberOfSections={() => SingerList.length}
                    numberOfRowsInSection={section => SingerList[section].items.length}
                    heightForSection={() => 36}
                    renderSection={this.renderSection.bind(this)}
                    heightForCell={() => 80}
                    renderCell={this.renderItem.bind(this)}
                    onSectionDidHangOnTop={this.onSectionChange.bind(this)}
                    renderItemSeparator={() => null}
                />}

                {SingerList && SingerList.length > 0 && <LargeList
                    style={{position: 'absolute', width: 44, right: 0, backgroundColor: 'transparent'}}
                    ref={ref => this.indexes = ref}
                    numberOfRowsInSection={() => SingerList.length}
                    heightForCell={() => 18}
                    renderCell={this.renderIndexes.bind(this)}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    renderItemSeparator={() => null}
                />}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listWrap: {
        position: 'absolute',
        backgroundColor: 'transparent',
        right: 0,
        width: 44,
    }
});

