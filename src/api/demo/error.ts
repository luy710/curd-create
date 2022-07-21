import defHttp from '@/request/axios'

enum Api {
  // The address does not exist
  Error = '/error'
}

/**
 * @description: Trigger ajax error
 */

export const fireErrorApi = () => defHttp.get({ url: Api.Error })
