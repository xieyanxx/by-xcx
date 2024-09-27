import { getStorageSync } from '@tarojs/taro';
import network from '../core/network';

export const RefundType:any = {
  0: '下单',
  1: '退款',
  2: '充值'
}

const Server = {
  /**
  * @description 登录
  * @param data
  * @returns
  */

  login: (data: { username: string, password: string }) => {
    return network.post('/mall/public/user/login', {}, data);
  },
  /**
   * @description 获取用户信息
   * @param data
   * @returns
   */

  getUserInfo: () => {
    return network.get('/mall/xcx/user/info');
  },

  /**
   * @description 获取商品列表
   * @param data 
   * @returns 
   */

  getGoodsList: (data: any) => {
    return network.post('/mall/xcx/public/product/list', {}, data).then(res => {
      if (getStorageSync('token')) {
        return network.post('/mall/xcx/shopping/cart/list', {}).then(data => {
          res = res.map((item: any) => {
            const carData = data.find((i: any) => i.productId === item.productId)
            item.productCount = carData?.productCount || 0
            return item
          })
          return res
        })
      }
      return res
    });
  },

  /**
   * @decsciption 获取分类列表
   * @param data 
   * @returns 
   */

  getCategoryList: () => {
    return network.get('/mall/xcx/public/category/list');
  },

  /**
  * @decsciption 获取下单列表
  * @param data 
  * @returns 
  */

  getOrderList: (data: any) => {
    return network.post('/mall/xcx/order/list', {}, data);
  },

  /**
   * 
   * @returns 获取购物车列表
   */
  getCarList: () => {
    return network.post('/mall/xcx/shopping/cart/list', {}).then(res => {
      res = res.map((item: any) => {
        item.options = [{
          text: '删除',
          style: {
            backgroundColor: '#FF4949',
            width: '50px',
            fontSize: '12px'
          },

        }];
        item.checked = false;
        item.isOpened = false;
        item.productPrice = item.productPrice / 100
        return item
      })
      return res
    }).catch(() => {
      return []
    });
  },
  /**
   * @description 更新购物车
   * @param data 
   * @returns 
   */
  updateCarList: (data: { productId: number, count: number }) => {
    return network.post('/mall/xcx/shopping/cart/update-item', {}, data);
  },
  /**
   * @description 获取账单列表
   * @param data 
   * @returns 
   */
  getBillList: (data: { start: number, end: number }) => {
    return network.post('/mall/xcx/billing/list', {}, data)
  },

  /**
   * @description 获取账单合计
   * @param data 
   * @returns 
   */
  getBillAll: (data: { start: number, end: number }) => {
    return network.post('/mall/xcx/billing/stats', {}, data)
  },


  /**
  * @description 购物车商品删除
  * @param data 
  * @returns 
  */
  delCarList: (data: { productId: number[] }) => {
    return network.post('/mall/xcx/shopping/cart/delete', {}, data);
  },

  /**
  * @description 下单
  * @param data 
  * @returns 
  */
  placeOrder: (data: { orderItems: { productId: number, count: number }[] }) => {
    return network.post('/mall/xcx/order/create', {}, data);
  },

  /**
  * @decsciption 获取退款列表
  * @param data 
  * @returns 
  */

  getRefundList: (data: any) => {
    return network.post('/mall/xcx/refund/list', {}, data);
  },

};

export default Server;