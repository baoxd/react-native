import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
} from 'react-native';

import ThemeLine from '../Home/ThemeLine';
import NewsGoodsView from '../Home/NewGoodsView';
import Disturb from '../../common/disrurbArray';


export default class CategoryListView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
        };
        this.itemDatas = props.itemDatas;
    }

    _onRefresh() {
        this.setState({
            isRefreshing: true,
        });
        this.itemDatas = Disturb(this.itemDatas.slice());
        setTimeout(() => {
            this.setState({
                isRefreshing: false,
            });
        }, 1000);
    }

    componentDidMount() {
        setInterval(() => {
            this.itemDatas = Disturb(this.itemDatas.slice());
        }, 1000);
    }

    render() {
        const { navigation } = this.props;
        return (
            <ScrollView
                refreshControl={
                <RefreshControl
                 refreshing={this.state.isRefreshing}
                 onRefresh={this._onRefresh.bind(this)}
                 tintColor="#000000"
                 title="loading"
                 colors={['#000000']}
                 progressBackgroundColor="#ffffff"
                 enabled={true}
                />
             }
                style={styles.container}
            >
                <ThemeLine name={'当季热销'}/>
                <NewsGoodsView
                    itemDatas={this.itemDatas}
                    navigation={navigation}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
});