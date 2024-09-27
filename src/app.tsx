
import { useLaunch } from '@tarojs/taro'
import './app.less'
import 'taro-ui/dist/style/index.scss'

const home=require('@/static/home.png')
const home1=require('@/static/home1.png')
const car=require('@/static/car.png')
const car1=require('@/static/car1.png')
const user=require('@/static/user.png')
const user1=require('@/static/user1.png')

function App({ children }:any) {

  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return children
}

export default App
