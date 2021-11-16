import { request, config, crypt } from 'utils'

const { transTypeList } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: transTypeList,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryInventoryType (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/misc/code/PRODINV?fields=miscName,miscDesc,miscVariable&as=code,type,variable',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: transTypeList,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
