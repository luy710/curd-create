import axios from '@/request/axios'
import { DemoParams } from './model/tableModel'

enum Api {
  DEMO_LIST = '/table/getDemoList'
}

/**
 * @description: Get sample list value
 */

export const demoListApi = (params: DemoParams) =>
  axios.get({
    url: Api.DEMO_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true
    }
  })
