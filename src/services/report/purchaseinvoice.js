import { request, config, crypt } from '../../utils'

const { purchase, purchaseDetail } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${purchase}/transNo/${params.transNo}`,
    method: 'get',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function queryDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: purchaseDetail,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

