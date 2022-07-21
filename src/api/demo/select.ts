import defHttp from '@/request/axios'
import { DemoOptionsItem, selectParams } from './model/optionsModel'
enum Api {
  OPTIONS_LIST = '/select/getDemoOptions'
}

/**
 * @description: Get sample options value
 */
export const optionsListApi = (params?: selectParams) =>
  defHttp.get<DemoOptionsItem[]>({ url: Api.OPTIONS_LIST, params })
