import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Alert,
    RefreshControl,
} from 'react-native';
import theme from '../../common/color';
import { width } from '../../common/screen';
import MessageView from './MessageView';
import { inject, observer } from 'mobx-react/native';
import { computed } from 'mobx';
// toast 组件
import Toast, {DURATION} from 'react-native-easy-toast';

@inject('rootStore')
@observer
export default class ItemDetail extends Component {

    static navigationOptions = {
        title: '商品信息',
        headerTitleStyle: {
            fontSize: 15,
            color: theme.fontColor,
        },
        headerStyle: {
            height: 38,
            backgroundColor: theme.color,
        },
    }

    constructor(props) {
        super(props);
        this.state = {
            num: 0,
            bounceValue: new Animated.Value(1),
        };
    }

    @computed get cartCount() {
        // return this.props.rootStore.CartStore.allDatas.data.length;
        return 0;
    }
    

    render() {
        const {name, price, image} = this.props.navigation.state.params.value;
        let count = this.cartCount;
        return (
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        tintColor='#000'
                        title='loading'
                        colors={['#000']}
                        progressBackgroundColor='#fff'
                        enabled={true}
                    />
                }
            >
                <View style={styles.topWrapper}>
                    <View style={styles.imgWrapper}>
                        <Image source={image} style={styles.image} />
                    </View>

                    <View style={styles.chooseLine}>
                        <Text style={styles.number}>数量 {this.state.num}</Text>
                        <TouchableOpacity style={styles.buttonWrap}>
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonWrap}>
                            <Text style={styles.buttonText}>-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addCart} onPress={()=>this.addCart(this.props.navigation.state.params.value)}>
                            <Text style={styles.buttonText}>加入购物车 ☝</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.message}>
                        <Text>有货</Text>
                        <Text style={{fontSize: 18, paddingTop: 5}}>{name}</Text>
                        <Text style={{fontSize: 16, paddingTop: 5, paddingBottom: 10}}>￥ {price}</Text>
                    </View>

                    <Animated.View style={[styles.cart2, {transform: [{scale: this.state.bounceValue}]}]}>
                        <TouchableOpacity onPress={() => {}}>
                            <Image source={require('../../img/cart2.png')}
                                style={{width: 45, height: 45}} />
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <View style={styles.bottomWrapper}>
                    <MessageView />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    topWrapper: {
        backgroundColor: '#fff',
        alignItems: 'center',
        flex: 1,
    },
    imgWrapper: {
        marginTop: 30,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    chooseLine: {
        marginTop: 40,
        marginLeft: 10,
        marginRight: 10,
        height: 65,
        backgroundColor: theme.color,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    number: {
        color: theme.fontColor,
        fontSize: 16,
        marginRight: 20,
        marginLeft: 35,
    },
    buttonWrap: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        borderColor: theme.fontColor,
        marginRight: 20,
    },
    buttonText: {
        color: theme.fontColor,
        fontSize: 16,
    },
    addCart: {
        marginRight: 35,
    },
    message: {
        paddingTop: 20,
        alignItems: 'center',
    },
    cart2: {
        position: 'absolute',
        width: 45,
        height: 45,
        top: 20,
        right: 30,
    },
    bottomWrapper: {
        flex: 1,
        marginTop: 20,
        backgroundColor: '#fff',
    }
});
