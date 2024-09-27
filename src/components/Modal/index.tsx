

import { AtModal } from 'taro-ui';
import Taro, { View, Button } from '@tarojs/components'
import styles from './index.module.less'
import cx from 'classnames'


export default function Modal(props: any) {
  const { isOpened, onOk, cancel } = props


  return <AtModal isOpened={isOpened} className={styles.modal_wrap}>
    <View className={styles.tip_text}>
      确认删除选中的商品吗?
    </View>
    <View className={styles.btn_wrap}> <Button className={styles.btn} onClick={cancel}>取消</Button> <Button className={cx(styles.btn, styles.wran)} onClick={onOk}>确定</Button> </View>
  </AtModal>

}
