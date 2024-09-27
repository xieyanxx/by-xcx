import { notice } from '@/helper/utils';
import { View, Text, Image, Form, CheckboxGroup, Checkbox, Button, } from '@tarojs/components'
import { useDidShow, useLoad, showLoading, hideLoading } from '@tarojs/taro'
import { useEffect, useState } from 'react';
import cx from 'classnames'
import { AtInputNumber, AtList, AtSwipeAction } from 'taro-ui';
import styles from './index.module.less';
import Modal from '@/components/Modal';
import Server from '@/helper/http/server';
import { debounce } from 'lodash';
import Empty from '@/components/Empty';


export default function Index() {
  const [loading, setLoading] = useState<boolean>(false);
  const [allChecked, setAllChecked] = useState<boolean>(false);//是否全选
  const [isManage, setIsManage] = useState<boolean>(false);
  const [carList, setCarList] = useState<any>([])
  const [delIsOpen, setDelIsOpen] = useState<boolean>(false)
  const [selectData, setSelectData] = useState<any>([]);
  const [allPrice, setAllPrice] = useState<number>(0)

  useDidShow(() => {
    setIsManage(false)
    getList()
  })
  const handleSingle = (item: any) => {
    handleDel([item])
  }
  const formSubmit = () => {
    setLoading(true)
    const orderItems = selectData.map((item: any) => ({ productId: item.productId, count: item.productCount }))
    Server.placeOrder(orderItems).then(res => {
      setLoading(false);
      getList()
      setAllPrice(0)
      setAllChecked(false);
      notice('下单成功')
    }).catch(() => {
      setLoading(false)
      notice('网络错误请重试！')
    })
  }
  //选择商品
  const handleSelect = (item: any, val: any) => {
    item.checked = !item.checked;
    if (val.value.length) {
      //判断选择数据是否已存在
      const hasObject = selectData.some((i: any) => i.productId === item.productId)
      const data = hasObject ? selectData : [...selectData, item]
      setSelectData(data)
    } else {
      //取消勾选
      const data = selectData.map((i: any) => i.productId !== item.productId)
      setSelectData(data)
    }
  }

  //计算价钱
  const countPrice = () => {
    const select = carList.filter((item: any) => item.checked);
    const sum = select.reduce((accumulator: any, obj: any) => accumulator + (obj.productPrice * obj.productCount), 0);
    setAllPrice(sum)
  }
  useEffect(() => {
    countPrice()
  }, [selectData,carList])

  //选择全部商品
  const selectAll = (e: any) => {
    const { value } = e.detail;
    if (value.length) {
      const newCarList = carList.map((item: any) => {
        item.checked = true;
        return item
      })
      setSelectData(newCarList)
      setAllChecked(true)
    } else {
      carList.map((item: any) => {
        item.checked = false;
      })
      setAllChecked(false);
      setSelectData([])
    }
  }

  //获取购物车列表
  const getList = () => {
    showLoading({ title: "加载中" })
    Server.getCarList().then(res => {
      setCarList(res);
      hideLoading();
    }).catch(() => {
      hideLoading();
      notice('网络错误请重试！')
    })
  }

  //改变商品数量
  const handleChangeNum = (item: any, num: number) => {
    delayedAdd({ productId: item.productId, count: num })
  }
  const delayedAdd = debounce((val: { productId: number, count: number }) => {
    Server.updateCarList(val).then(() => {
      //选择效果后端没保存由前端控制
      carList.map((item: any) => {
        if (item.productId == val.productId) {
          item.productCount = val.count
        }
      })

      //选择的数据
      const changeData = selectData.map((i: any) => {
        if (i.productId == val.productId) {
          i.productCount = val.count
        }
        return i
      })
      setSelectData(changeData)

    })
  }, 300);

  //删除商品
  const handleDel = (val: any) => {
    const productIds = val.map((item: any) => item.productId);
    showLoading({ title: "加载中" })
    Server.delCarList(productIds).then(() => {
      notice('操作成功');
      hideLoading();
      getList();
      setAllPrice(0)
      setAllChecked(false);
      setSelectData([])
      handleCancel()
    }).catch(() => {
      hideLoading();
      notice('网络错误请重试！')
    })
  }

  //取消
  const handleCancel = () => {
    setDelIsOpen(false)
  }


  return (
    <View className={styles.wrap}>
      <View className={styles.banner}>
        <Image className={styles.banner_img} src={require("@/static/bg1.png")}></Image>
      </View>
      <View className={styles.title}>购物车</View>
      {carList.length?<>
      
        <View className={styles.content_wrap}>
        <View className={cx(styles.manage_wrap, isManage && styles.out)} onClick={() => setIsManage(!isManage)}>{isManage ? '退出管理' : "管理"}</View>
        <Form className={styles.form_wrap}>
          <AtList>
            {carList.map((item: any, index: number) => (
              <AtSwipeAction
                className={styles.action_wrap}
                key={index}
                onClick={() => handleSingle(item)}
                isOpened={item.isOpened}
                options={item.options}
              >
                <CheckboxGroup className={styles.group_wrap} onChange={({ detail }) => handleSelect(item, detail)}>
                  <Checkbox className={styles.checked_wrap} value={item.productId.toString()} checked={item.checked} />
                  <View className={styles.goods_info}>
                    <Image className={styles.img} src={item.productPic}></Image>
                    <View className={styles.info_wrap}>
                      <View className={styles.name}>{item.productName}</View>
                      {/* <View className={styles.weight}>{item.weight}</View> */}
                      <View className={styles.price_wrap}><Text className={styles.unit_wrap}>￥<Text className={styles.price}>{item.productPrice}<Text className={styles.unit}>/{item.productUnit}</Text></Text></Text><AtInputNumber
                        className={styles.num_wrap}
                        type={'number'}
                        min={1}
                        max={100}
                        step={1}
                        width={48}
                        value={item.productCount}
                        onChange={(value) => handleChangeNum(item, value)}
                      /></View>
                    </View>
                  </View>
                </CheckboxGroup>
              </AtSwipeAction>
            ))}
          </AtList>
        </Form>
      </View>
      <View className={styles.operation_wrap}>
        <CheckboxGroup className={styles.group_wrap} onChange={(e) => selectAll(e)}>
          <Checkbox className={styles.checked_wrap} value='All' checked={allChecked} >全选</Checkbox>
        </CheckboxGroup>
        <View className={styles.r_wrap}>
          {!isManage ? <>
            <Text className={styles.r_text}>合计:<Text className={styles.price}><Text className={styles.unit}>￥</Text>{allPrice}</Text></Text>
            <Button className={styles.btn} loading={loading} onClick={formSubmit} >去下单</Button>
          </> : <Button className={styles.del_btn} plain type='warn' onClick={() => setDelIsOpen(true)}>删除</Button>}
        </View>
      </View>

      <Modal isOpened={delIsOpen} onOk={() => handleDel(selectData)} cancel={handleCancel}></Modal>
      </>:<Empty></Empty>}
      
    </View>
  )
}
