import { observable, computed, action } from 'mobx';
import newGoods from './newGoods';

/**
 * 根store
 */
class RootStore {
    constructor() {
        this.NewGoodsStore = new NewGoodsStore(newGoods, this);
        this.CartStore = new CartStore(this);
        this.OrderStore = new OrderStore(this);
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

// 订单
class OrderStore {
    @observable
    allDatas = [];

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    /**
     * 添加订单
     * @param {[type]} order 订单数据，每个订单数据包含一个总价字段， 一个物品数组
     */
    @action
    addOrder(order) {
        if (order) {
            this.allDatas.push(order);
        }
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
        let { data } = this.allDatas;
        let index = -1;

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
                ...{count: num},
            });
        }
        this.allDatas.isAllSelected = data.every((v) => v.isSelected);
    }

    /**
     * 是否全选设置
     * @param  {Boolean} isSelectAll 是否全选
     * @return {[type]}
     */
    @action
    setSelectAll(isSelectAll) {
        if (typeof isSelectAll !== 'boolean') {
            return;
        }
        const { data } = this.allDatas;
        this.allDatas.isAllSelected = isSelectAll;

        data.forEach((v, i) => {
            v.isSelected = isSelectAll;
        })
    }

    /**
     * 清空已支付的购物车
     * @return {[type]}
     */
    @action
    deleteHasPaid() {
        const { data } = this.allDatas;
        this.allDatas.data = data.filter((v) => {
            return !v.isSelected;
        });
        if (this.allDatas.data.length === 0) {
            this.allDatas.isAllSelected = false;
        }
    }

    @computed get totalMoney() {
        let money = 0;
        let arr = this.allDatas.data.filter((v) => {
            return v.isSelected === true;
        });

        arr.forEach((v, i) => {
            money += v.price * v.count;
        });
        return money;
    }


}

export default new RootStore();