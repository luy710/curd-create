import type { selectParams } from './model/optionsModel'
import axios from '@/request/axios'

enum Api {
  OPTIONS_LIST = '/select/getDemoOptions',
}

/**
 * @description: Get sample options value
 */
export const optionsListApi = (params?: selectParams) => axios.get({ url: Api.OPTIONS_LIST, params })
