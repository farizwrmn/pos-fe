import { request, config, crypt, lstorage } from 'utils'

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
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${paymentOpts}/report/ar/time`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPaymentARGroup (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  params.order = '+invoiceDate'
  return request({
    url: `${paymentOpts}/report/ar/group`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
