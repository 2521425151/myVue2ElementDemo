import http from './http'

/**
 * get请求
 * @param {string} url - 请求地址
 * @param {object} params - 请求发送数据
 * @returns {promise} - 请求返回promise
 */
export function sendGet(url: string, params: object = {}, options: object = {}): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      options['params'] = params
      let res = await http.get(url, options)
      if (res) {
        resolve(res)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * post请求
 * @param {string} url - 请求地址
 * @param {object} params - 请求发送数据
 * @returns {promise} - 请求返回promise
 */
export function sendPost(url: string, params: object = {}): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await http.post(url, params)
      if (res) {
        resolve(res)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * put请求
 * @param {string} url - 请求地址
 * @param {object} params - 请求发送数据
 * @returns {promise} - 请求返回promise
 */
export function sendPut(url: string, params: object = {}): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await http.put(url, params)
      if (res) {
        resolve(res)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * delete请求
 * @param {string} url - 请求地址
 * @param {object} params - 请求发送数据
 * @returns {promise} - 请求返回promise
 */
export function sendDelete(url: string, params: object = {}): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await http.delete(url, { params })
      if (res) {
        resolve(res)
      }
    } catch (e) {
      reject(e)
    }
  })
}
