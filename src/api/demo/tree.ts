import axios from '@/request/axios'

enum Api {
  TREE_OPTIONS_LIST = '/tree/getDemoOptions',
}

/**
 * @description: Get sample options value
 */
export const treeOptionsListApi = (params?: Recordable) => axios.get({ url: Api.TREE_OPTIONS_LIST, params })
