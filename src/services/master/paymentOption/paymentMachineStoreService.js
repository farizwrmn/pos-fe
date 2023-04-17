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
