import Modal from "@/components/Modal";
import Server from "@/helper/http/server";
import { handleAmount, hidePhone, notice } from "@/helper/utils";
import { View, Text, Image } from "@tarojs/components";
import Taro, {
  getStorageSync,
  navigateTo,
  useDidShow,
  showLoading,
  hideLoading,
  clearStorage,
  reLaunch
} from "@tarojs/taro";
import { useEffect, useState } from "react";
import styles from "./index.module.less";

export default function Index() {
  const [userInfo, setUserInfo] = useState<any>({});
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false)


  useDidShow(() => {
    setIsLogin(getStorageSync("token") ? true : false)
  });
  useEffect(() => {
    if (isLogin) {
      getUserInfo()
    }
  }, [isLogin])

  /** 获取用户信息 */
  const getUserInfo = () => {
    showLoading({ title: "加载中" });
    Server.getUserInfo()
      .then((res) => {
        setUserInfo(res);
        hideLoading();
      })
      .catch(() => {
        hideLoading();
        notice("网络错误请重试！");
      });
  };

  /** 退出登录 */
  const handleOut = () => {
    clearStorage();
    reLaunch({ url: "/otherpage/login/index" })
  }

  return (
    <View className={styles.wrap}>
      <View className={styles.banner}></View>
      <View className={styles.content_wrap}>
        <View className={styles.head_wrap}>
          <View className={styles.left}>
            <Image
              className={styles.head_img}
              src={require("@/static/head.png")}
            ></Image>
            <View className={styles.user_info}>
              {isLogin ? (
                <View>
                  <Text>{userInfo?.username}</Text>
                  <View className={styles.phone}>
                    {hidePhone(userInfo?.phone)}
                  </View>
                </View>
              ) : (
                  <Text
                    className={styles.login_text}
                    onClick={() => {
                      navigateTo({ url: "/otherpage/login/index" });
                    }}
                  >
                    登录
                  </Text>
                )}
            </View>
          </View>
          {isLogin && <View className={styles.login_out} onClick={() => { setIsOpen(true) }}>退出</View>}

        </View>
        <View className={styles.amount_wrap}>
          <View className={styles.item}>
            <View className={styles.name}>余额(元)</View>
            <View className={styles.num}>
              {handleAmount(userInfo?.balance)}
            </View>
          </View>
          <View className={styles.item}>
            <View className={styles.name}>欠款(元)</View>
            <View className={styles.num}>
              {handleAmount(userInfo?.debt)}
            </View>
          </View>
        </View>

        <View className={styles.order_wrap}>
          <View className={styles.title}>常用功能</View>
          <View className={styles.item_wrap}>
            <View
              className={styles.item}
              onClick={() => {
                if (isLogin) {
                  navigateTo({ url: "/otherpage/orderRecord/index" });
                } else {
                  navigateTo({ url: "/otherpage/login/index" });
                }
              }}
            >
              <Image
                className={styles.item_img}
                src={require("@/static/order.png")}
              ></Image>
              <Text className={styles.name}>下单记录</Text>
            </View>
            <View
              className={styles.item}
              onClick={() => {
                if (isLogin) {
                  navigateTo({ url: "/otherpage/refundRecord/index" });
                } else {
                  navigateTo({ url: "/otherpage/login/index" });
                }
              }}
            >
              <Image
                className={styles.item_img}
                src={require("@/static/refund.png")}
              ></Image>
              <Text className={styles.name}>退货记录</Text>
            </View>
            <View
              className={styles.item}
              onClick={() => {
                if (isLogin) {
                  navigateTo({ url: "/otherpage/bill/index" });
                } else {
                  navigateTo({ url: "/otherpage/login/index" });
                }
              }}
            >
              <Image
                className={styles.item_img}
                src={require("@/static/bill.png")}
              ></Image>
              <Text className={styles.name}>资金流水</Text>
            </View>
          </View>
        </View>
      </View>
      <Modal isOpened={isOpen} title="确认要退出登录吗?" onOk={() => handleOut()} cancel={() => setIsOpen(false)}></Modal>
    </View>
  );
}
