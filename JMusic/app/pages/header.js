import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    StatusBar,
    TouchableOpacity,
    FlatList,
    ScrollView,
} from 'react-native';

import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import NavBarView from '../base/NavBarView';
// 歌手
import Recommend from './recommend';
// 推荐
import Singer from './singer';
// 排行榜
import Rank from './rank';


export default class Header extends Component {

    static navagationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
        };
        this.bgColor = '#222',
        this.tabJson = require('../source/json/nav.json');
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    animated={true}
                    backgroundColor={this.bgColor}
                    barStyle="light-content"
                />
                <NavBarView
                    backgroundColor={this.bgColor}
                />

                <View style={styles.Mheader}>
                    <Image style={styles.icon} source={require('../source/images/logo.png')}/>
                    <Text style={styles.headerText}>JMusic</Text>
                </View>

                <ScrollableTabView
                    initialPage={0}
                    tabBarBackgroundColor="#222"
                    tabBarActiveTextColor="#ffcd32"
                    tabStyle={{
                        borderWidth: 0,
                        borderColor: 'red'
                    }}
                    tabBarInactiveTextColor="hsla(0, 0%, 100%, .5)"
                    tabBarUnderlineStyle={{
                        backgroundColor: '#ffcd32',
                    }}
                    renderTabBar={() => <DefaultTabBar/>}
                >
                    <Recommend
                        tabLabel="推荐"
                        navigate={this.props.navigation.navigate}
                    />
                    <Singer
                        tabLabel="歌手"
                        navigate={this.props.navigation.navigate}
                    />
                    <Rank navigate={this.props.navigation.navigate} tabLabel="排行"></Rank>
                    <View tabLabel="搜索"></View>
                </ScrollableTabView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222222'
    },
    Mheader: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 30,
        height: 32,
    },
    headerText: {
        fontSize: 18,
        color: '#ffcd32',
        marginLeft: 10,
    }
});