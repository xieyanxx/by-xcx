import Server from '@/helper/http/server';
import { CategoryType, GoodsType } from '@/helper/http/server/type';
import { handleAmount, notice } from '@/helper/utils';
import { View, Text, Image, Input, } from '@tarojs/components'
import { useDidShow, useLoad, showLoading, hideLoading } from '@tarojs/taro'
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
    Server.getGoodsList(val)
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
    let num = ++val.productCount;
    const data = {
      productId: val.productId,
      count: num
    }
    delayedAdd(data)
  }

  const delayedAdd = debounce((val: { productId: number, count: number }) => {
    Server.updateCarList(val).then(() => {
      getProduct()
    })
  }, 300);


  return (
    <View className={styles.wrap}>
      <View className={styles.banner}>
        <Image className={styles.banner_img} src={require('@/static/banner.png')} />
      </View>
      <View className={styles.content}>
        <View className={styles.search_wrap}>
          <Image className={styles.icon} src={require('@/static/icon1.png')} />
          <Input className={styles.input} value={productName} placeholder='搜索商品' />
          <View className={styles.text}>搜索</View>
        </View>
        <View className={styles.type_wrap}>
          {categoryList.map(item =>
            <View className={styles.item} key={item.id}>
              <Image src={item.pic} className={styles.item_img} />
              <Text>{item.name}</Text>
            </View>
          )}
          <View className={styles.item}>
            <Image src={require('@/static/type.png')} className={styles.item_img} />
            <Text>川渝火锅</Text>
          </View>
          <View className={styles.item}>
            <Image src={require('@/static/type.png')} className={styles.item_img} />
            <Text>川渝火锅</Text>
          </View>
          <View className={styles.item}>
            <Image src={require('@/static/type.png')} className={styles.item_img} />
            <Text>川渝火锅</Text>
          </View>
          <View className={styles.item}>
            <Image src={require('@/static/type.png')} className={styles.item_img} />
            <Text>川渝火锅</Text>
          </View>
          <View className={styles.item}>
            <Image src={require('@/static/type.png')} className={styles.item_img} />
            <Text>川渝火锅</Text>
          </View>
          <View className={styles.item}>
            <Image src={require('@/static/type.png')} className={styles.item_img} />
            <Text>川渝火锅</Text>
          </View>
        </View>
        <View className={styles.list_wrap}>
          {goodsList.map(item =>
            <View className={styles.list_item} key={item.productId}>
              <Image className={styles.img} src={item.productPic}></Image>
              <View className={styles.name}>{item.productName}</View>
              <View className={styles.price_wrap}>
                <Text className={styles.price_text}><Text className={styles.unit}>￥</Text>{handleAmount(item.productPrice)}</Text>
                <View className={styles.add_wrap} onClick={() => handleChange(item)}>
                  <Image className={styles.add_img} src={require('@/static/add.png')} />
                  {item.productCount > 0 && <View className={styles.num} >{item.productCount}</View>}

                </View>

              </View>
            </View>
          )}
          {/* <View className={styles.list_item}>
            <Image className={styles.img} src={require('@/static/goods.png')}></Image>
            <View className={styles.name}>毛肚黄牛大叶2斤/袋</View>
            <View className={styles.price_wrap}>
              <Text className={styles.price_text}><Text className={styles.unit}>￥</Text>20</Text>
              <Image className={styles.add_img} src={require('@/static/add.png')} />
            </View>
          </View>
          <View className={styles.list_item}>
            <Image className={styles.img} src={require('@/static/goods.png')}></Image>
            <View className={styles.name}>毛肚黄牛大叶2斤/袋</View>
            <View className={styles.price_wrap}>
              <Text className={styles.price_text}><Text className={styles.unit}>￥</Text>20</Text>
              <Image className={styles.add_img} src={require('@/static/add.png')} />
            </View>
          </View>
          <View className={styles.list_item}>
            <Image className={styles.img} src={require('@/static/goods.png')}></Image>
            <View className={styles.name}>毛肚黄牛大叶2斤/袋</View>
            <View className={styles.price_wrap}>
              <Text className={styles.price_text}><Text className={styles.unit}>￥</Text>20</Text>
              <Image className={styles.add_img} src={require('@/static/add.png')} />
            </View>
          </View> */}
        </View>
      </View>

    </View>
  )
}
