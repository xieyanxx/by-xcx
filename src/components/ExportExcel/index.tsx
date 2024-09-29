import Taro, { Text, View } from "@tarojs/components";
import styles from "./index.module.less";
import * as XLSX from 'xlsx';
import { formatTime, handleAmount } from "@/helper/utils";
import { RefundType } from "@/helper/http/server";
import { getFileSystemManager, showToast, openDocument,env } from '@tarojs/taro'

export default function ExportExcel(props: any) {
  const { exportData } = props;
  
  const exportExcel1 = () => {
    const data=exportData.map((item:any)=>{
    let newObj={
      'ID':item.id,
      "姓名":item.username,
      "电话":item.phone,
      "类型":RefundType[item.type],
      "金额(元)":`${item.income?'+':'-'}${handleAmount(item.amount)}`,
      "时间":formatTime(item.createTime)
    }
    return newObj
  })

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    

    // 导出 Excel 文件
    const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const filePath = `${env.USER_DATA_PATH}/example.xlsx`;
    const fileManager =getFileSystemManager();

    fileManager.writeFile({
      filePath,
      data: excelBuffer,
      encoding: 'binary',
      success: () => {
        showToast({ title: '导出成功', icon: 'success' });
        // 触发文件下载
        openDocument({
          filePath,
          fileType: 'xlsx',
          success: () => {
            console.log('文件打开成功');
          },
          fail: (err) => {
            console.error('文件打开失败', err);
          }
        });
      },
      fail: (err) => {
        console.error('文件写入失败', err);
      }
    });
  }

  return <View className={styles.btn_wrap} onClick={exportExcel1}>导出明细</View>
}
