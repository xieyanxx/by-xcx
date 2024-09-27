import Server from '@/helper/http/server';
import { notice } from '@/helper/utils';
import { View, Text, Image, Form, Input, Button, Checkbox } from '@tarojs/components'
import { setStorageSync, useLoad, switchTab } from '@tarojs/taro'
import { useState } from 'react';
import styles from './index.module.less';


export default function Index() {
  const [loading, setLoading] = useState<boolean>(false);
  const [select, setSelect] = useState<boolean>(true)
  const formSubmit = (e: any) => {
    const { password, username } = e.target.value
    if (!password || !username) {
      notice('请输入用户名及密码')
      return
    }
    if (!select) {
      notice('请勾选用户协议')
      return
    }
    setLoading(true)
    Server.login({ username, password }).then(res => {
      setLoading(false)
      setStorageSync('token', `${res.tokenType} ${res.accessToken}`)
      switchTab({ url: '/pages/home/index' })
    })
  }

  return (
    <View className={styles.wrap}>
      <Image className={styles.logo} src={require('@/static/logo.png')} />
      <Text className={styles.text}>账号登录</Text>
      <Form onSubmit={formSubmit} className={styles.form_wrap}>
        <Input type='text' name='username' className={styles.input_wrap} placeholder='请输入用户名' focus />
        <Input password name='password' className={styles.input_wrap} placeholder='请输入密码' />
        <Button loading={loading} form-type='submit' className={styles.btn_wrap}>登录</Button>

      </Form>
      <Checkbox className={styles.checked_wrap} value='选中' onChange={() => setSelect(!select)} checked={select}><View className={styles.text_tip}>我已阅读并同意百优优选《用户注册协议》与《隐私协议》</View></Checkbox>
    </View>
  )
}
