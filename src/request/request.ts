import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface PendingType {
  url?: string
  method?: String | undefined
  params?: any
  data?: any
  cancel: (val: any) => void
}
export const baseURL = '/basic-api'
// axios实例
const instance = axios.create({
  timeout: 30000,
  params: {},
  baseURL,
  data: {},
  headers: {
    ContentType: 'application/json;charset=UTF-8'
  },
  responseType: 'json'
})

// 添加请求拦截器
instance.interceptors.request.use(
  (request: AxiosRequestConfig) => {
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 添加相应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (!error || !error.response) {
      return Promise.reject('请求出错')
    }

    return Promise.reject(error?.response)
  }
)

export default instance
