import { request, config, crypt, lstorage } from 'utils'

const { paymentOpts } = config.api

export async function queryPayableWithBank (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${paymentOpts}/report/ap`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPaymentAP (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${paymentOpts}/report/ap/time`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPaymentAPGroup (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  params.sort_by = '+invoiceDate,-paid,+memberName'
  return request({
    url: `${paymentOpts}/report/ap/group`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
