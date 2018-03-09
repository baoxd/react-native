import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { width } from '../../common/screen';

export default class NewGoodsItem extends Component {

    static propTypes = {
        name: PropTypes.string,
        price: PropTypes.string,
        image: PropTypes.number,
        onPress: PropTypes.func,
    }

    static defaultProps = {
        name: '',
        price: 0,
        image:-1,
        onPress: () => {},
    }

    constructor(props) {
        super(props);
    }

    render() {
        const { name, price, image, onPress } = this.props;
        return (
            <TouchableOpacity onPress={() => onPress && onPress()}>
                <View style={styles.item}>
                    <Image source={image} style={styles.image}/>
                    <Text>{name}</Text>
                    <Text>￥ {price}/500g</Text>
                </View>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    item: {
        width: (width - 40) / 2,
        height: 150,
        flexDirection: 'column',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 10,
        borderRadius: 20,
        backgroundColor: '#f5f6f5',
        alignItems: 'center',   
    },
    image: {
        width: 100,
        height: 100,
    }
});