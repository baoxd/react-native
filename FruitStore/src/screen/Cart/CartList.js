import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    PixelRatio,
} from 'react-native';

import { observer } from 'mobx-react';
import Toast, {DURATION} from 'react-native-easy-toast';

import theme from '../../common/color';
import { width, height } from '../../common/screen';

export default class CartList extends Component {

    static propTypes = {
        dataSource: PropTypes.array,
        CartStore: PropTypes.object,
    }

    static defaultProps = {
        dataSource: [],
        CartStore: {},
    }

    constructor(props) {
        super(props);

    }

    // 切换选择
    toggleSelect(item) {
        const { CartStore } = this.props;
        CartStore.toggleSelect(item);
    }

    // 购物车减一
    reduceCount(item) {
        const { CartStore } = this.props;
        if (item.count === 0) {
            this._toast.show('不能再减了哦~');
            return;
        }
        CartStore.add(item, -1);
    }

    // 购物车加一
    addCount(item) {
        const { CartStore } = this.props;
        CartStore.add(item, 1);
    }

    // 删除购物车
    deleteCart(item) {
        const { CartStore } = this.props;
        CartStore.deleteCart(item);
    }

    // 渲染每个条目
    _renderItem = ({item}) => {
        const { name, price, count, image, isSelected } = item;
        return (
            <View style={styles.itemWrap}>
                <TouchableOpacity
                    style={{marginLeft: 12}}
                    onPress={() => this.toggleSelect(item)}
                >
                    <Image 
                        source={
                            isSelected ? require('../../img/radio_selected.png') :
                            require('../../img/radio_normal.png')
                        }
                        style={{width: 20, height: 20}}
                    />
                </TouchableOpacity>
                <Image source={image} style={styles.image} />

                <View style={styles.rightWrap}>
                    <View style={styles.top}>
                        <Text style={[styles.text, {flex: 1, textAlign: 'center'}]}>{name}</Text>
                        <Text style={[styles.text, {flex: 1, textAlign: 'center'}]}>￥ {price}/500g</Text>
                    </View>

                    <View style={styles.bottom}>
                        <TouchableOpacity
                            style={{paddingLeft: 10, paddingRight: 30}}
                            onPress={() => this.reduceCount(item)}
                        >
                            <Text style={styles.text}>-</Text>
                        </TouchableOpacity>
                        <Text>{count}</Text>
                        <TouchableOpacity
                            style={{paddingLeft: 30, paddingRight: 10}}
                            onPress={() => this.addCount(item)}
                        >
                            <Text>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{paddingLeft: 45}}
                            onPress={() => this.deleteCart(item)}
                        >
                            <Text>删除</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    // 生成key
    _keyExtractor(item, index) {
        return `${index}_${item.name}_${item.isSelected}`;
    }

    render() {
        const { dataSource } = this.props;

        return (
            <View style={styles.container}>
                <FlatList
                    data={dataSource.slice()}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                />
                <Toast
                    ref={(ref) => this._toast = ref}
                    positionValue={200}
                    fadeInDuration={650}
                    fadeOutDuration={650}
                    opacity={.8}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    itemWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 130,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#ccc',
    },
    image: {
        width: 100,
        height: 100,
        marginLeft: 18,
        marginRight: 10,
    },
    rightWrap: {
        flex: 1,
        flexDirection: 'column',
        height: 100,
    },
    top: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 5,
    },
    bottom: {
        // flex:1,
        flexDirection: 'row',
    },
    text: {
        fontSize:15,
        color: '#000',
    }
});
