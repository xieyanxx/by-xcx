
import { View, Text, Image, } from '@tarojs/components'

import styles from './index.module.less';


export default function Empty() {

  return (

    <View className={styles.empty_wrap}>
      <Image className={styles.empty} src={require("@/static/empty.png")}></Image>
      <View>暂无内容～</View>
    </View>
  )
}
