import { message } from 'antd'
import { request, config, crypt } from '../../utils'

const { balanceShift } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: balanceShift,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryByStoreId (params) {
  const apiHeaderToken = crypt.apiheader()
  const { storeId } = params
  if (!storeId) {
    message.error('Store ID needed for this action!')
    return
  }
  return request({
    url: `${balanceShift}/store/${storeId}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryAdd (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: balanceShift,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryEdit (params) {
  const apiHeaderToken = crypt.apiheader()
  const { id } = params
  if (!id) {
    message.error('id needed to complete this action!')
    return
  }
  return request({
    url: `${balanceShift}/${id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryDelete (params) {
  const apiHeaderToken = crypt.apiheader()
  const { id } = params
  if (!id) {
    message.error('id needed to complete this action!')
    return
  }
  return request({
    url: `${balanceShift}/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}
