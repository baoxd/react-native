import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import NewGoodsItem from './NewGoodsItem';
import { width } from '../../common/screen';
import newGoods from '../../mobx/newGoods';

const NewGoodsView = (props) => {
    let { itemDatas } = props;

    if (!itemDatas) {
        itemDatas = newGoods.data;
    }

    return (
        <View style={styles.container}>
            {
                itemDatas.map((value, index) => {
                    return (
                        <NewGoodsItem
                            name={value.name}
                            price={value.price}
                            image={value.image}
                            key={`newgooditem_${index}`}
                            onPress={ () => {
                                alert(111);
                            }}
                        />
                    );
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        flexWrap: 'wrap',
    },

});

export default NewGoodsView;