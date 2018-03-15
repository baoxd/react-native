import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';

import { observer } from 'mobx-react';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast, {DURATION} from 'react-native-easy-toast';
import { width } from '../../common/screen'
import theme from '../../common/color';

@observer
export default class CartCheckOut extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visiable: false,
            loadText: '正在支付中...',
        };
    }

    // 渲染按钮点击
    _allSelect() {
        const { CartStore } = this.props;
        let isAllSelected = CartStore.allDatas.isAllSelected;
        CartStore.setSelectAll(!isAllSelected);
    }

    // 付款
    pay() {
        Alert.alert(
            '您好',
            `总计：￥ ${this.props.CartStore.totalMoney}`,
            [
                {text: '确认支付', onPress: () => this.clearCart()},
                {text: '下次再买', onPress: () => null},
            ],
            { cancelable: false}
        );
    }

    // 清空购物车
    clearCart() {
        const CartStore = this.props.CartStore;
        const { totalMoney, data } = CartStore.allDatas;
        const OrderStore = CartStore.rootStore.OrderStore;
        this.setState({
            visiable: true,
        });

        setTimeout(() => {
            this.setState({
                loadText: '支付成功！欢迎下次光临！'
            });
            setTimeout(() => {
                let order = {
                    date: new Date(),
                    totalMoney: totalMoney,
                };
                order.data = data.filter((v) => {
                     return v.isSelected === true;
                });
                // 添加到订单
                OrderStore.addOrder(order);
                // 清空已支付的购物车
                CartStore.deleteHasPaid();
                this.setState({visiable: false});
            }, 1500);
        }, 2000);
    }

    render() {
        const { allDatas, totalMoney } = this.props.CartStore;
        const { isAllSelected } = allDatas;

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this._allSelect()}>
                    <Image
                        source={
                            isAllSelected ? require('../../img/radio_selected.png') 
                            : require('../../img/radio_normal.png')
                        }
                        style={styles.image}
                    />
                </TouchableOpacity>
                <View style={styles.selectAll}>
                    <Text style={{fontSize: 16}}>全选</Text>
                </View>
                <View>
                    <Text style={{fontSize: 22, color: '#000'}}>￥ {totalMoney}</Text>
                </View>

                <TouchableOpacity
                    onPress={() => this.pay()}
                    style={styles.pay}
                >
                    <Text>付款</Text>
                </TouchableOpacity>

                <Spinner visible={this.state.visiable} textContent={this.state.loadText} textStyle={{fontSize: 15,color: '#FFF'}} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        height: 50,
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: theme.color
    },
    image: {
        width: 30,
        height: 30,
        marginLeft: 10,
    },
    selectAll: {
        marginLeft: 5,
        flex: 1,
    },
    pay: {
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
    }
});
