import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    PixelRatio,
} from 'react-native';

import theme from '../../common/color';

export default class MineScreen extends Component {

    static navigationOptions = {
        title: '我的',
        headerTitleStyle: {
            fontSize: 15,
            color: theme.fontColor,
            alignSelf: 'center'
        },
        headerStyle: {
            height: 38,
            backgroundColor: theme.color
        }
    }

    constructor(props) {
        super(props);
    }

    // type: 点击类型
    _onPress(type) {
        const { navigation } = this.props;
        if (type && type === 'order') {
            navigation.navigate('Order')
        }
    }

    render() {
        const list = [{
            title: '我的订单',
            subTitle: '查看详情',
            type: 'order',
        },{
            title: '我的收货地址',
            subTitle: '查看',
            type: '',
        },{
            title: '我的收藏',
            subTitle: '♥',
            type: '',
        },{
            title: '我的评价',
            subTitle: '☀',
            type: '',
        },{
            title: '会员中心',
            subTitle: '☺',
            type: '',
        },{
            title: '优惠卷',
            subTitle: '✉',
            type: '',
        },{
            title: '联系我们',
            subTitle: '☎',
            type: '',
        },{
            title: '关于',
            subTitle: '版本: 1.0',
            type: '',
        }];
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.headerImgWrap}
                    >
                        <Image source={require('../../img/smile.png')} style={styles.headImg}/>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Hello! 小吃货</Text>
                </View>
                <ScrollView style={styles.listWrap}>
                    {
                        list.map((v, i) => (
                            <View style={styles.item} key={`${v.title}_${i}`}>
                                <Text style={styles.itemLeft}>{v.title}</Text>
                                <TouchableOpacity
                                    onPress={() => this._onPress(v.type) }
                                    style={styles.itemRight}
                                >
                                    <Text style={styles.itemRightText}>{v.subTitle}</Text>
                                    <Image source={require('../../img/cell_arrow.png')} style={{width: 15, height: 15,}}/>
                                </TouchableOpacity>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        // flex: 1,
        flexDirection: 'row',
        height: 80,
        backgroundColor: theme.color,
        alignItems: 'center',
    },
    headerImgWrap: {
        marginLeft: 14,
        marginRight: 6,
    },
    headImg: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    headerTitle: {
        fontSize: 15,
        color: '#000',
    },
    listWrap: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 14,
    },
    item: {
        height: 40,
        flexDirection: 'row',
        paddingLeft: 12,
        paddingRight: 12,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#ccc',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    itemLeft: {
        flex: 1,
        color: '#000',
        fontSize: 15,
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemRightText: {
        fontSize: 15,
        color: '#000',
        marginRight: 10,
    }
});