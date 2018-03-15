import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    PixelRatio,
} from 'react-native';

import { inject, observer } from 'mobx-react';

import theme from '../../common/color';

@inject('rootStore')
export default class OrderScreen extends Component {

    static navigationOptions = {
        title: '订单列表',
        headerTitleStyle: {
            alignSelf: 'center',
            fontSize: 15,
            color: theme.fontColor,
        },
        headerStyle: {
            height: 38,
            backgroundColor: theme.color,
        }
    };

    constructor(props) {
        super(props);
    }

    // 格式化日期
    formatDate(d) {
        return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    }

    render() {
        const orders = this.props.rootStore.OrderStore.allDatas;
        return (
            <View>
                {
                    orders.map((v, i) => (
                        <View style={styles.order}>
                            <View style={styles.orderLeft}>
                                <Text style={styles.leftText}>{this.formatDate(v.date)}</Text>
                                {
                                    v.data.map((vv, ii) => (
                                        <View style={styles.cartItem}>
                                            <Text style={styles.leftText}>{vv.name} {vv.count}*{vv.price}/500g</Text>
                                        </View>
                                    ))
                                }
                            </View>
                            <View style={styles.orderRight}>
                                <Text style={{fontSize: 18, color: '#000'}}>总价 ￥{v.totalMoney}</Text>
                            </View>
                        </View>
                    ))
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    order: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#ccc',
    },
    orderLeft: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    cartItem: {
        flexDirection: 'row',
    },
    leftText: {
        fontSize: 14,
        color: '#000',
    },
    orderRight: {
        marginRight: 20,
    },
});