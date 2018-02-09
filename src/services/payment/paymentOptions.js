import { request, config, crypt } from 'utils'

const { paymentOpts } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: paymentOpts + '/option',
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}