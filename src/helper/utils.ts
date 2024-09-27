import { showToast } from "@tarojs/taro";
import dayjs from 'dayjs';
export function notice(val: string) {
  showToast({ title: val, icon: 'none' })
}
/**
 * 
 * @param phoneNumber 手机号隐藏中间四位
 * @returns 
 */
export function hidePhone(phoneNumber?: string) {
  return phoneNumber ? phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : ''
}

/**
 * 
 * @param amount 处理金额后端返回为分
 * @returns 
 */
export function handleAmount(amount?: number) {
  return amount ? amount / 100 : 0
}

/**
 * 
 * @param time 处理时间
 * @returns 
 */
export function formatTime(time: number | string | Date | undefined) {
  try {
    if (time) {
      const data = dayjs(time);
      return data.valueOf() >= 0 ? data.format('YYYY-MM-DD HH:mm:ss') : '-';
    }
    return '-';
  } catch (e) {
    return '-';
  }
}