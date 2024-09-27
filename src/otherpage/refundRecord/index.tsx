
import { View, Text, Image, ScrollView, } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import dayjs from 'dayjs';
import cx from 'classnames'

import Server from '@/helper/http/server';
import { formatTime, handleAmount, notice } from '@/helper/utils';
import { RefundType } from '@/helper/http/server/type';
import FloatModal from '@/components/FloatModal';
import Empty from '@/components/Empty';

type Time = {
  end: string, start: string
}
export default function Index() {
  const [selectTime, setSelectTime] = useState<Time>({
    end: dayjs().format('YYYY-MM-DD'),
    start: dayjs().add(-7, 'd').startOf('day').format('YYYY-MM-DD')
  })
  const [isShow, setIsShow] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number>(1)
  const [refundList, setRefundList] = useState<RefundType>([]);
  const [isOpenTime, setIsOpenTime] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isRefresh, setIsRefresh] = useState<boolean>(false)

  const pageRef = useRef(0);

  useDidShow(() => {
    getRefundList(selectTime)
  })

  /** 刷新 */
  const refresh = () => {
    setIsRefresh(true)
    setTotalPage(0);
    getRefundList({
      end: dayjs().format('YYYY-MM-DD'),
      start: dayjs().add(-7, 'd').startOf('day').format('YYYY-MM-DD')
    })

  }

  /** 获取退款列表 */
  const getRefundList = useCallback((time: Time) => {
    const params = {
      start: dayjs(time.start + '00:00:00').valueOf(),
      end: dayjs(time.end + '23:59:59').valueOf(),
      pageNumber: 0,
      pageSize: 10,
    }
    Server.getRefundList(params).then((res) => {
      setRefundList(res.content)
      setCurrentId(res.content[0]?.id)
      setTotalPage(res.totalPages)
      setIsRefresh(false)
    }).catch(() => {
      setIsRefresh(false)
      notice('网络错误请重试！')
    });
  }, [])

  /**
  * @description 获取下一页
  */
  const nextPage = useCallback(() => {
    pageRef.current++;
    /** 因为页码是从0页开始所以需要总页数-1 */
    if (pageRef.current > totalPage - 1) return
    const params = {
      start: dayjs(selectTime.start + '00:00:00').valueOf(),
      end: dayjs(selectTime.end + '23:59:59').valueOf(),
      pageNumber: pageRef.current,
      pageSize: 10,
    }
    Server.getRefundList(params).then((res) => {
      setRefundList((pre) => {
        return [...pre, ...res.content];
      });
    }).catch(() => {
      notice('网络错误请重试！')
    });
  }, []);

  /**
   * @description 关闭时间弹窗
   */
  const handleClose = () => {
    setIsOpenTime(false);
  }

  return (
    <View className={styles.wrap}>
      <View className={styles.top_wrap}>
        <View className={styles.time_wrap} onClick={() => setIsOpenTime(true)}>
          <Text className={styles.time} >{`${selectTime.start} - ${selectTime.end}`} </Text><Image className={styles.icon} src={require('@/static/down.png')}></Image>
        </View>
      </View>
      {refundList.length ? <View className={styles.conten_wrap}>
        <ScrollView scrollY={true} style={{ height: '100%' }} refresherBackground={'none'} lowerThreshold={50} refresherEnabled refresherTriggered={isRefresh} onRefresherRefresh={refresh} onScrollToLower={nextPage}>
          {refundList.map(item =>
            <View className={styles.list_wrap} key={item.id}>
              <View className={styles.list_item}>
                <View className={cx(styles.goods_wrap, (isShow && currentId == item.id) && styles.show_more)}>
                  {item.items.map((i) => <View key={i.product.productId} className={styles.goods_item}>
                    <Image className={styles.goods_img} src={i.product.productPic}></Image>
                    <View className={styles.info_wrap}>
                      <View className={styles.name}><View className={styles.title}>{i.product.productName}</View><View><Text className={styles.text}>￥</Text>{handleAmount(i.product.productPrice)}</View></View>
                      <View className={styles.num}>数量：{i.refundCount}</View>
                    </View>
                  </View>)}
                </View>
                {item.items.length > 3 && <View className={styles.open} onClick={() => { setIsShow(!isShow) }}>{isShow && currentId == item.id ? '收起' : '展开'}</View>}
                <View className={styles.line} />
                <View className={styles.time}>下单时间：{formatTime(item.createTime)}</View>
                <View className={styles.price}><View className={styles.orderId}>订单编号：{item.orderNo}</View><View className={styles.unit}> <Text className={styles.text}>￥</Text>{handleAmount(item.orderRefundAmount)}</View></View>
              </View>
            </View>
          )}
        </ScrollView>
      </View> : <Empty />}
      <FloatModal isOpened={isOpenTime} close={handleClose} getRefundList={(val: Time) => getRefundList(val)} setSelectTime={(val: { end: string, start: string }) => setSelectTime(val)} selectTime={selectTime}></FloatModal>
    </View>
  )
}
