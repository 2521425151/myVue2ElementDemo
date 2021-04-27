//接口封装
import { sendGet, sendPost, sendPut, sendDelete } from '@/utils/static/requestWay'

// 退出登录
export const loginOut = () => sendGet('/logout')
