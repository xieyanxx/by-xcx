

import { AtCalendar, AtFloatLayout, AtModal } from 'taro-ui';
import Taro, { View, Button } from '@tarojs/components'
import styles from './index.module.less'
import dayjs from 'dayjs';
import { useState } from 'react';


export default function FloatModal(props: any) {
  const { isOpened, close, setSelectTime, selectTime,getOrderList } = props;
  const [time, setTime] = useState(selectTime)

  return <AtFloatLayout isOpened={isOpened} className={styles.wrap} onClose={() => {
    setSelectTime(time)
    getOrderList(time)
    close();
  }}>

    <AtCalendar minDate="2024-01-01" onSelectDate={(data: any) => {
      const { value } = data
      setTime(value)
    }} className={styles.calendar_wrap} isVertical isMultiSelect maxDate={dayjs().endOf('month').format('YYYY-MM-DD')} currentDate={{ start: selectTime.start, end: selectTime.end }} />

  </AtFloatLayout>

}
