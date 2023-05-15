import { request, config, crypt } from 'utils'

const { paymentMachineStore } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: paymentMachineStore,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryUnrelated (params) {
  const apiHeaderToken = crypt.apiheader()
  const { storeId, ...other } = params
  if (!storeId) {
    return false
  }
  return request({
    url: `${paymentMachineStore}/unrelated/${storeId}`,
    method: 'get',
    data: other,
    headers: apiHeaderToken
  })
}

export async function queryAdd (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: paymentMachineStore,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryDelete (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentMachineStore}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
