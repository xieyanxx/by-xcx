import Server from '@/helper/http/server';
import { CategoryType, GoodsType } from '@/helper/http/server/type';
import { handleAmount, notice } from '@/helper/utils';
import { View, Text, Image, Input } from '@tarojs/components'
import Taro, { useDidShow, showLoading, hideLoading, getStorageSync, navigateTo, useReachBottom, usePullDownRefresh } from '@tarojs/taro'
import { debounce } from 'lodash';


import { useCallback, useRef, useState } from 'react';
import styles from './index.module.less';


export default function Index() {
  const [categoryList, setCategoryList] = useState<CategoryType>([]);
  const [goodsList, setGoodsList] = useState<GoodsType[]>([]);
  const [productName, setProductName] = useState<string>('');
  const [totalPage, setTotalPage] = useState<number>(0);
  const pageRef = useRef(0);

  useDidShow(() => {
    getCategory();
    getProduct()
  })
  //获取分类列表
  const getCategory = useCallback(() => {
    Server.getCategoryList()
      .then((res) => {
        setCategoryList(res)
      })
      .catch(() => {
        notice('网络错误请重试！')
      });
  }, [])

  //获取商品列表
  const getProduct = useCallback((val?: any) => {
    showLoading({ title: "加载中" })
    Server.getGoodsList({
      productName: val,
      pageNumber: 0,
      pageSize: 10,
    })
      .then((res) => {
        setGoodsList(res.content);
        setTotalPage(res.totalPages)
        hideLoading()
      })
      .catch(() => {
        hideLoading()
        notice('网络错误请重试！')
      });
  }, [])


  const handleChange = (val: GoodsType) => {
    if (getStorageSync("token")) {
      let num = ++val.productCount;
      const data = {
        productId: val.productId,
        count: num
      }
      delayedAdd(data)
    } else {
      navigateTo({ url: "/otherpage/login/index" });
    }

  }

  const delayedAdd = debounce((val: { productId: number, count: number }) => {
    Server.updateCarList(val).then(() => {
      let newData = goodsList.map((item) => {
        if (val.productId === item.productId) {
          item.productCount = val.count
        }
        return item
      })
      setGoodsList(newData);
    })
  }, 300);

  const handleSearch = () => {
    getProduct(productName)
  }

  /** 获取查询值 */
  const getInputValue = ({ detail }: any) => {
    const { value } = detail
    setProductName(value)
  }

  /** 刷新 */
  const refresh = () => {
    pageRef.current = 0
    setTotalPage(0);
    getProduct()
    getCategory();
  }

  /**
 * @description 获取下一页
 */
  const nextPage = useCallback(() => {
    pageRef.current++;
    /** 因为页码是从0页开始所以需要总页数-1 */
    if (pageRef.current > totalPage - 1) return
    const params = {
      pageNumber: pageRef.current,
      pageSize: 10,
      productName: productName,
    }
    Server.getGoodsList(params).then((res) => {
      setGoodsList((pre) => {
        return [...pre, ...res.content];
      });
    }).catch(() => {
      notice('网络错误请重试！')
    });
  }, [totalPage, productName]);
  /** 下拉刷新 */
  usePullDownRefresh(() => {
    refresh()
  })

  /** 加载更多 */
  useReachBottom(() => {
    nextPage()
  })

  return (
    <View className={styles.wrap}>
      <View className={styles.banner}>
        <Image className={styles.banner_img} src={require('@/static/banner.png')} />
      </View>
      <View className={styles.content}>
        <View className={styles.search_wrap}>
          <Image className={styles.icon} src={require('@/static/icon1.png')} />
          <Input className={styles.input} value={productName} onInput={getInputValue} placeholder='搜索商品' />
          <View className={styles.text} onClick={handleSearch}>搜索</View>
        </View>
        <View className={styles.type_wrap}>
          {categoryList.map(item =>
            <View className={styles.item} key={item.id}>
              <Image src={item.pic} className={styles.item_img} />
              <Text>{item.name}</Text>
            </View>
          )}
        </View>
        {goodsList.length ?

          <View className={styles.list_wrap} >
            {goodsList.map(item =>
              <View className={styles.list_item} key={item.productId}>
                <Image className={styles.img} src={item.productPic}></Image>
                <View className={styles.name}>{item.productName}</View>
                <View className={styles.price_wrap}>
                  {getStorageSync("token") ? <Text className={styles.price_text}><Text className={styles.unit}>￥</Text>{handleAmount(item.productPrice)}<Text className={styles.unit}>/{item.productUnit}</Text></Text> :
                    <Text className={styles.text_wrap}>价格登录后可见</Text>
                  }

                  <View className={styles.add_wrap} onClick={() => handleChange(item)}>
                    <Image className={styles.add_img} src={require('@/static/add.png')} />
                    {item.productCount > 0 && <View className={styles.num} >{item.productCount}</View>}
                  </View>
                </View>
              </View>
            )}
          </View> : <View className={styles.empty_wrap}>
            <Image className={styles.empty} src={require("@/static/empty.png")}></Image>
            <View> 暂无商品～</View>
          </View>}
      </View>

    </View>
  )
}
