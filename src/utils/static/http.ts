import axios from 'axios'

// 创建axios实例常量配置
const axiosCreate = {
  // 根据环境配置后端api的url
  baseURL: process.env.VUE_APP_API_URL,
  // 请求超时时间
  timeout: 30000,
  // 是否允许后端设置cookie跨域，一般无需改动
  // withCredentials: true,
  validateStatus: function (status: any) {
    // 若状态码大于等于400时则Reject 用来统一处理XX报错走catch方法
    return status < 400
  }
}

// 创建axios实例
const http = axios.create(axiosCreate)

/**
 * axios request拦截器
 * 要求后端不管成功与否返回数据结构
 */
http.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * axios respone拦截器
 */
http.interceptors.response.use(
  config => {
    return config.data || {}
  },
  error => {
    return Promise.reject(error)
  }
)

export default http
