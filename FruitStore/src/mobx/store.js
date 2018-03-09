import { observable, computed, action } from 'mobx';
import newGoods from './newGoods';

/**
 * 根store
 */
class RootStore {
    constructor() {
        this.NewGoodsStore = new NewGoodsStore(newGoods, this);
    }
}

// 首页新品
class NewGoodsStore {

    @observable
    allDatas = {}

    constructor(data, rootStore) {
        this.allDatas = data;
        this.rootStore = rootStore;
    }
}

export default new RootStore();