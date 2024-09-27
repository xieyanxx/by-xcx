
import { View} from '@tarojs/components'
import styles from './index.module.less';
import Order from '@/components/Order';


export default function Index() {

  return (
    <View className={styles.wrap}>
      <Order type={1}></Order>

    </View>
  )
}
