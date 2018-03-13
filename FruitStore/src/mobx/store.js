import { observable, computed, action } from 'mobx';
import newGoods from './newGoods';

/**
 * 根store
 */
class RootStore {
    constructor() {
        this.NewGoodsStore = new NewGoodsStore(newGoods, this);
        this.CartStore = new CartStore(this);
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

// 购物车
class CartStore {
    @observable
    allDatas = {}

    constructor(rootStore) {
        this.allDatas = {
            "data": [
            ],
            "isAllSelected" : true,
            "totalMoney" : 0
        };
        this.rootStore = rootStore;
    }

    /**
     * 添加购物车
     * item: 添加的商品
     * num: 添加数量
     * 
     */
    @action
    add(item, num) {
        if (num < 0) {
            return;
        }
        let { data, totalMoney } = this.allDatas;
        let index = -1;
        totalMoney = totalMoney + num * item.price;

        data.forEach((v, i) => {
            if (item.name === v.name) {
                index = i;
            }
        });
        if (index !== -1) {
            data[index].count +=num;
        } else {
            data.push({
                ...item,
                ...{count: num}
            });
        }
        this.allDatas.totalMoney = totalMoney;
    }

}

export default new RootStore();