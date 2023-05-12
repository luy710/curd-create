import type { AccountParams, DeptListItem, MenuParams, RolePageParams, RoleParams } from './model/systemModel'
import axios from '@/request/axios'

enum Api {
  AccountList = '/system/getAccountList',
  IsAccountExist = '/system/accountExist',
  DeptList = '/system/getDeptList',
  setRoleStatus = '/system/setRoleStatus',
  MenuList = '/system/getMenuList',
  RolePageList = '/system/getRoleListByPage',
  GetAllRoleList = '/system/getAllRoleList',
}

export const getAccountList = (params: AccountParams) => axios.get({ url: Api.AccountList, params })

export const getDeptList = (params?: DeptListItem) => axios.get({ url: Api.DeptList, params })

export const getMenuList = (params?: MenuParams) => axios.get({ url: Api.MenuList, params })

export const getRoleListByPage = (params?: RolePageParams) => axios.get({ url: Api.RolePageList, params })

export const getAllRoleList = (params?: RoleParams) => axios.get({ url: Api.GetAllRoleList, params })

export function setRoleStatus(id: number, status: string) {
  return axios.post({ url: Api.setRoleStatus, params: { id, status } })
}

export const isAccountExist = (account: string) => axios.post({ url: Api.IsAccountExist, data: { account } })
