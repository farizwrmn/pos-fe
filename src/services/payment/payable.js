import { request, config, crypt, lstorage } from 'utils'

const { paymentOpts } = config.api

export async function queryPayable (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${paymentOpts}/payable/purchase`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/payable-detail/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/payable`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPaymentGroup (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/payable`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPaymentWithPOS (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/report/purchase`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPaymentSplit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/payable/some`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/payable`,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function addSome (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/some`,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function cancelPayment (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/payable/cancel`,
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}
