import { request, config, crypt } from 'utils'

const { paymentOpts } = config.api

export async function queryPaymentWithPOS (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/report/pos`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPaymentAR (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/report/ar/time`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
