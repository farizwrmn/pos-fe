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

export async function queryAdd (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: paymentMachineStore,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
