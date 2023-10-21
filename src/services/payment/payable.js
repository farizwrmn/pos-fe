import { request, crypt, lstorage } from 'utils'

export async function queryPayable (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: '/payment/payable/purchase',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/payment/payable-detail/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/payment/payable',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPaymentGroup (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/payment/payable',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPaymentWithPOS (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/payment/report/purchase',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPaymentSplit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/payment/payable/some',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/payment/payable',
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function addSome (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/payment/some',
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function cancelPayment (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/payment/payable/cancel',
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function updatePurchaseById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/payment/payable/purchase/${params.id}`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
