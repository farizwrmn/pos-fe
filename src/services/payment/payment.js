import { request, config, crypt } from 'utils'

const { paymentOpts } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/pos`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}-detail/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPaymentGroup (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPaymentWithPOS (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/report/pos`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}


export async function queryPaymentInvoice (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/invoice`,
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}`,
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
    url: `${paymentOpts}/cancel`,
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}
