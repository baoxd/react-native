import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Image,
} from 'react-native';

import { observer, inject } from 'mobx-react';
import { computed } from 'mobx';

import theme from '../../common/color';
import { width, height } from '../../common/screen';
import CartList from './CartList';
import CartCheckOut from './CartCheckOut';

@inject('rootStore')
@observer
export default class CartScreen extends Component {

    static navigationOptions = ({navigation, screenProps}) => (
        navigation.state.params && navigation.state.params.headerStyle ?
        {
            title: '购物车',
            headerTitleStyle: navigation.state.params.headerStyle,
            headerStyle: styles.headerStyle,
        } :
        {
            title: '购物车',
            headerTitleStyle: styles.headerTitleStyle,
            headerStyle: styles.headerStyle,
        }
    )

    constructor(props) {
        super(props)
    }

    @computed get dataSource() {
        return this.props.rootStore.CartStore.allDatas.data.slice();
    }

    render() {
        const { CartStore } = this.props.rootStore;
        const dataSource = this.dataSource;

        return (
            <View style={styles.container}>
                {
                    this.dataSource.length ?
                    <View style={{flex: 1,}}>
                        <View style={{height: height - 38 - 50 - 65}}>
                            <CartList dataSource={dataSource} CartStore={CartStore}/>
                        </View>
                        <CartCheckOut CartStore={CartStore} />
                    </View>
                    :
                    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                        <Text>购物车是空的哦~请到首页或者分类页添加哈๑乛◡乛๑</Text>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerTitleStyle: {
        alignSelf: 'center',
        fontSize: 15,
        color: theme.fontColor,
    },
    headerStyle: {
        height: 38,
        backgroundColor: theme.color,
    },
});