import {
    Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const jumpPage = (navigate, page, params) => {
    if (params != null) {
        navigate(page, {
            data: params,
        });
    } else {
        navigate(page);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * ( max - min + 1) + min);
}

function shuffle(arr) {
    const _arr = arr.slice();
    for(let i = 0 ; i < _arr.length; i++) {
        let j = getRandomInt(0, i);
        [_arr[i], _arr[j]] = [_arr[j], _arr[i]];
    }
    return _arr;
}

export { jumpPage, width, height, shuffle };