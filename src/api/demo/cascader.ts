import axios from '@/request/axios'
import type { AreaParams } from '@/api/demo/model/areaModel'

enum Api {
  AREA_RECORD = '/cascader/getAreaRecord',
}

export const areaRecord = (data: AreaParams) => axios.post({ url: Api.AREA_RECORD, data })
