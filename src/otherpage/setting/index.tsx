
import { View } from '@tarojs/components'
import styles from './index.module.less';
import cx from 'classnames'
import { clearStorageSync } from '@tarojs/taro';

export default function Index() {

  const loginOut=()=>{
    clearStorageSync()
    
  }

  return (
    <View className={styles.wrap}>
        <View className={styles.login_out} onClick={loginOut}>退出登陆</View>
    </View>
  )
}
