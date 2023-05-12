import type { DemoParams } from './model/tableModel'
import axios from '@/request/axios'

enum Api {
  DEMO_LIST = '/table/getDemoList',
}

/**
 * @description: Get sample list value
 */

export function demoListApi(params: DemoParams) {
  return axios.get({
    url: Api.DEMO_LIST,
    params,
    headers: {
      // @ts-expect-error
      ignoreCancelToken: true,
    },
  })
}
