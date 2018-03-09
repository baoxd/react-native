import React from 'react';
import {
    StyleSheet,
    Text,
    Iamge,
    View
} from 'react-native';

import {
    StackNavigator,
    TabNavigator,
    TabBarBottom,
} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';  
import HomeScreen from './screen/Home/HomeScreen';
import TabBarItem from './common/tabBarItem';
import theme from './common/color';

import { Provider } from 'mobx-react';
import store from './mobx/store';

const Navigation = () => {
    return (
        <Provider rootStore={store}>
            <Navigator />
        </Provider>
    );
}

const tabOptions = {
    Home: {
        screen: HomeScreen,
        navigationOptions: ({navigation}) => (
            {
                tabBarLabel: '主页',
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarItem
                        tintColor={tintColor}
                        focused={focused}
                        selectedImage={require('./img/homeSelect.png')}
                        normalImage={require('./img/home.png')}
                    />
                )
            }
        )
    },
};

const screenOptions = {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: true,
    lazy: true,
    tabBarOptions: {
        activeTintColor: theme.color,
        inactiveTintColor: '#979797',
        labelStyle: {
            fontSize: 12,
        }
    }
};

// TabNavigator
const Tab = TabNavigator(tabOptions, screenOptions);

const Navigator = StackNavigator({
    Tab: {screen: Tab},
}, {
    navigationOptions: {
        // 开启动画
        animationEnabled: true,
        // 开启边缘触摸返回
        gesturesEnabled: true,
    },
    mode:'card',
    transitionConfig: () => ({
        // 统一安卓和苹果页面跳转的动画
        screenInterpolator: CardStackStyleInterpolator.forHorizontal,
    })
});

export default Navigation;
