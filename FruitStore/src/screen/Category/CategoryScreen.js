import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import theme from '../../common/color';
import CategoryListView from './CategoryListView';

import { inject, observer } from 'mobx-react';

@inject('rootStore')
@observer
export default class CategoryScreen extends Component {

    static navigationOptions = {
        title: '分类',
        headerTitleStyle: {
            alignSelf: 'center',
            fontSize: 15,
            color: theme.fontColor,
        },
        headerStyle: {
            height: 38,
            backgroundColor: theme.color,
        },
    }

    render() {
        const data = this.props.rootStore.CategoryGoodsStore.allDatas.data;

        return (
            <ScrollableTabView
                style={styles.container}
                tabBarBackgroundColor='white'
                tabBarActiveTextColor={theme.color}
                tabBarTextStyle={styles.tabBarText}
                tabBarUnderlineStyle={styles.tabBarUnderline}
            >
                {
                    data.map((v, i) => (
                        <CategoryListView
                            tabLabel={v.title}
                            key={i}
                            itemDatas={v.detail}
                            navigation={this.props.navigation}
                        />
                    ))
                }
            </ScrollableTabView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    tabBarText: {
        fontSize: 14,
        marginTop: 13,
    },
    tabBarUnderline: {
        backgroundColor: theme.color,
    }
});


