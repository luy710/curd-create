import { UploadApiResult } from './model/uploadModel'
import defHttp from '@/request/axios'
import { UploadFileParams } from '/#/axios'
import { useGlobSetting } from '/@/hooks/setting'

const { uploadUrl = '' } = useGlobSetting()

/**
 * @description: Upload interface
 */
export function uploadApi(params: UploadFileParams, onUploadProgress: (progressEvent: ProgressEvent) => void) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: uploadUrl,
      onUploadProgress
    },
    params
  )
}
