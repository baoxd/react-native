import React from 'react';
import {
    Image,
} from 'react-native';

const TabBarItem = ({tintColor, focused, selectedImage, normalImage}) => {
    return (
        <Image
            source={focused ? selectedImage : normalImage}
            style={{width: 25, height: 25}}
        />
    );
}

export default TabBarItem;