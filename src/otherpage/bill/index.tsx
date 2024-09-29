
import { View, Text, Image, Picker, } from '@tarojs/components'
import { useDidShow, useLoad, showLoading, hideLoading } from '@tarojs/taro'
import { useCallback, useState } from 'react';
import styles from './index.module.less';
import dayjs from 'dayjs';
import cx from 'classnames'
import Server, { RefundType } from '@/helper/http/server';
import { BillType } from '@/helper/http/server/type';
import { formatTime, handleAmount, notice } from '@/helper/utils';
import ExportExcel from '@/components/ExportExcel';

export default function Index() {
  const [selectMonth, setSelectMonth] = useState<string>(dayjs().startOf('month').format('YYYY-MM'))
  const [billList, setBillList] = useState<BillType>([])
  const [amount,setAmount]=useState<any>()
  const onDateChange = (e: any) => {
    const { value } = e.detail;
    setSelectMonth(value)
    getBillList(value)
    getBillAll(value)
  }

  useDidShow(() => {
    getBillList(selectMonth)
    getBillAll(selectMonth)
  })
  //获取账单列表
  const getBillList = useCallback((selectData: string) => {
    const params = {
      start: dayjs(selectData).startOf('month').valueOf(),
      end: dayjs(selectData).endOf('month').valueOf()
    }
    showLoading({ title: '加载中' }),
      Server.getBillList(params)
        .then(({ content }) => {
          setBillList(content);
          hideLoading()
        })
        .catch(() => {
          hideLoading()
          notice('网络错误请重试！')
        });
  }, [selectMonth])

  /** 获取所选时间内账单总计 */
  const getBillAll=useCallback((selectData: string)=>{
    const params = {
      start: dayjs(selectData).startOf('month').valueOf(),
      end: dayjs(selectData).endOf('month').valueOf()
    }
      Server.getBillAll(params)
        .then((res) => {
          setAmount(res)
        })
  },[selectMonth])

  return (
    <View className={styles.wrap}>
      <View className={styles.top_wrap}>
        <Picker value={selectMonth} className={styles.picker_wrap} style={{ color: '#666666', background: '#FFFFFF' }} fields='month' start='2023-01-01' end={dayjs().endOf('year').format('YYYY-MM-DD')} mode='date' onChange={onDateChange}>
          <View className={styles.time_wrap}>
            <Text className={styles.time}>{selectMonth} </Text><Image className={styles.icon} src={require('@/static/down.png')}></Image>
          </View>
        </Picker>
        <ExportExcel exportData={billList}></ExportExcel>
        {/* <Text className={styles.export}>导出明细</Text> */}
      </View>
      <View className={styles.conten_wrap}>
        <View className={styles.content}>
          <View className={styles.amount}>
            <View className={styles.item}>合计支出: ￥{handleAmount(amount?.totalOutcome)}</View>
            <View className={styles.item}>合计退款:￥{handleAmount(amount?.totalRefund)}</View>
          </View>
          <View className={styles.list_wrap}>
            {billList.map((item, index) =>
              <View className={styles.list_item} key={index}>
                <View className={styles.item_r}>
                  <View className={styles.type}>{RefundType[item.type]}</View>
                  <View className={styles.time}>{formatTime(item.createTime)}</View>
                </View>
                <View className={cx(styles.num, item.income && styles.add)}>{item.income ? '+' : '-'}{handleAmount(item.amount)}</View>
              </View>
            )}

          </View>
        </View>
      </View>

    </View>
  )
}
