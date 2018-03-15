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
import CategoryScreen from './screen/Category/CategoryScreen';
import CartScreen from './screen/Cart/CartScreen';
import ItemDetail from './screen/ItemDetail/ItemDetail';
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
    Category: {
        screen: CategoryScreen,
        navigationOptions: ({navigation}) => (
            {
                tabBarLabel: '分类',
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarItem
                        tintColor={tintColor}
                        focused={focused}
                        selectedImage={require('./img/categorySelect.png')}
                        normalImage={require('./img/category.png')}
                    />
                ),
            }
        )
    },
    Cart: {
        screen: CartScreen,
        navigationOptions: ({navigation}) => (
            {
                tabBarLabel: '购物车',
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarItem
                        tintColor={tintColor}
                        focused={focused}
                        selectedImage={require('./img/cartSelect.png')}
                        normalImage={require('./img/cart.png')}
                    />
                ),
            }
        ),
    },
    Mine: {
        screen: HomeScreen,
        navigationOptions: ({navigation}) => (
            {
                tabBarLabel: '我的',
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarItem
                        tintColor={tintColor}
                        focused={focused}
                        selectedImage = {require('./img/mineSelect.png')}
                        normalImage = {require('./img/mine.png')}
                    />
                ),
            }
        ),
    }
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
    ItemDetail: {screen: ItemDetail},
    Cart: {screen: CartScreen},

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
