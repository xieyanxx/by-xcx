import Server from '@/helper/http/server';
import { CategoryType, GoodsType } from '@/helper/http/server/type';
import { handleAmount, notice } from '@/helper/utils';
import { View, Text, Image, Input, } from '@tarojs/components'
import { useDidShow, useLoad, showLoading, hideLoading, getStorageSync,navigateTo } from '@tarojs/taro'
import { debounce } from 'lodash';


import { useCallback, useState } from 'react';
import styles from './index.module.less';


export default function Index() {
  const [categoryList, setCategoryList] = useState<CategoryType>([]);
  const [goodsList, setGoodsList] = useState<GoodsType[]>([]);
  const [productName, setProductName] = useState<string>('')

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
    Server.getGoodsList({ productName: val })
      .then((res) => {
        setGoodsList(res);
        hideLoading()
      })
      .catch(() => {
        hideLoading()
        notice('网络错误请重试！')
      });
  }, [])


  const handleChange = (val: GoodsType) => {
    if(getStorageSync("token")){
      let num = ++val.productCount;
      const data = {
        productId: val.productId,
        count: num
      }
      delayedAdd(data)
    }else{
      navigateTo({ url: "/otherpage/login/index" });
    }
    
  }

  const delayedAdd = debounce((val: { productId: number, count: number }) => {
    Server.updateCarList(val).then(() => {
      getProduct()
    })
  }, 300);

  const handleSearch = () => {
    getProduct(productName)
  }

  const getInputValue = ({ detail }: any) => {
    const { value } = detail
    setProductName(value)

  }


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
        {goodsList.length ? <View className={styles.list_wrap}>
          {goodsList.map(item =>
            <View className={styles.list_item} key={item.productId}>
              <Image className={styles.img} src={item.productPic}></Image>
              <View className={styles.name}>{item.productName}</View>
              <View className={styles.price_wrap}>
                <Text className={styles.price_text}><Text className={styles.unit}>￥</Text>{handleAmount(item.productPrice)}<Text className={styles.unit}>/{item.productUnit}</Text></Text>
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
