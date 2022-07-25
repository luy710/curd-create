import instance from './request'
import { AxiosRequest, CustomResponse } from './request.interface'

class Abstract {
  private apiAxios({ method, url, data, params, headers }: AxiosRequest): Promise<CustomResponse> {
    return new Promise((resolve, reject) => {
      instance({
        method,
        url,
        params,
        data,
        headers
      })
        .then((res) => {
          const { code, message, result } = res.data
          resolve({
            code,
            result,
            message
          })
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * GET类型的网络请求
   */
  get({ url, data, params, headers }: AxiosRequest): Promise<CustomResponse> {
    return this.apiAxios({ method: 'GET', url, data, params, headers })
  }

  /**
   * POST类型的网络请求
   */
  post({ url, data, params, headers }: AxiosRequest): Promise<CustomResponse> {
    return this.apiAxios({ method: 'POST', url, data, params, headers })
  }

  /**
   * PUT类型的网络请求
   */
  put({ url, data, params, headers }: AxiosRequest): Promise<CustomResponse> {
    return this.apiAxios({ method: 'PUT', url, data, params, headers })
  }

  /**
   * DELETE类型的网络请求
   */
  delete({ url, data, params, headers }: AxiosRequest): Promise<CustomResponse> {
    return this.apiAxios({ method: 'DELETE', url, data, params, headers })
  }
}

export default new Abstract()
