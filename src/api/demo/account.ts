import axios from '@/request/axios'

enum Api {
  ACCOUNT_INFO = '/account/getAccountInfo',
  SESSION_TIMEOUT = '/user/sessionTimeout',
  TOKEN_EXPIRED = '/user/tokenExpired',
}

// Get personal center-basic settings

export const accountInfoApi = () => axios.get({ url: Api.ACCOUNT_INFO })

export const sessionTimeoutApi = () => axios.post({ url: Api.SESSION_TIMEOUT })

export const tokenExpiredApi = () => axios.post({ url: Api.TOKEN_EXPIRED })
