import Server from '@/helper/http/server';
import { userInfoType } from '@/helper/http/server/type';
import { handleAmount, hidePhone, notice } from '@/helper/utils';
import { View, Text, Image, } from '@tarojs/components'
import { getStorageSync, useLoad, navigateTo, useDidShow, showLoading, hideLoading } from '@tarojs/taro'
import { useCallback, useState } from 'react';
import styles from './index.module.less';



export default function Index() {
  const [loading, setLoading] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<userInfoType>()

  useDidShow(() => {
    console.log(1111)
    getUserInfo()
  })

  const getUserInfo = () => {
    if (!getStorageSync('token')) return;
    showLoading({ title: '加载中' })
    Server.getUserInfo()
      .then((res) => {
        setUserInfo(res);
        hideLoading()
      })
      .catch(() => {
        hideLoading()
        notice('网络错误请重试！')
      });
  }



  return (
    <View className={styles.wrap}>
      <View className={styles.banner}></View>
      <View className={styles.content_wrap}>
        <View className={styles.head_wrap}>
          <Image className={styles.head_img} src={require('@/static/head.png')}></Image>
          <View className={styles.user_info}>
            {getStorageSync('token') ? <>
              <Text>{userInfo?.username}</Text>
              <View className={styles.phone}>{hidePhone(userInfo?.phone)}</View>
            </> : <Text className={styles.login_text} onClick={() => {
              navigateTo({ url: "/otherpage/login/index" })
            }}>登录</Text>}
          </View>
        </View>
        <View className={styles.amount_wrap}>
          <View className={styles.item}>
            <View className={styles.name}>余额(元)</View>
            <View className={styles.num}>{handleAmount(userInfo?.balance)}</View>
          </View>
          <View className={styles.item}>
            <View className={styles.name}>欠款(元)</View>
            <View className={styles.num}>{handleAmount(userInfo?.debtBalance)}</View>
          </View>
        </View>

        <View className={styles.order_wrap}>
          <View className={styles.title}>常用功能</View>
          <View className={styles.item_wrap}>
            <View className={styles.item} onClick={() => navigateTo({ url: '/otherpage/orderRecord/index' })}>
              <Image className={styles.item_img} src={require('@/static/order.png')}></Image>
              <Text className={styles.name}>下单记录</Text>
            </View>
            <View className={styles.item} onClick={() => navigateTo({ url: '/otherpage/refundRecord/index' })}>
              <Image className={styles.item_img} src={require('@/static/refund.png')}></Image>
              <Text className={styles.name}>退货记录</Text>
            </View>
            <View className={styles.item} onClick={() => navigateTo({ url: '/otherpage/bill/index' })}>
              <Image className={styles.item_img} src={require('@/static/bill.png')}></Image>
              <Text className={styles.name}>资金流水</Text>
            </View>
          </View>

        </View>
      </View>
    </View>
  )
}
