import { request, config, crypt } from '../utils'
const { purchase, purchaseDetail } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: purchase,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function queryDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: purchaseDetail,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function create (params) {
  let url = params.id ? purchase : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken,
  })
}

export async function createDetail (params) {
  let url = params.id ? `${purchaseDetail}/purchase` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken,
  })
}

export async function createVoidDetail (params) {
  let url = params.id ? `${purchaseDetail}/void` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken,
  })
}

export async function edit (params) {
  let url = params.id !== null ? purchaseDetail : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken,
  })
}

export async function editPurchase (params) {
  let url = params.id !== null ? purchase : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken,
  })
}

export async function remove (params) {
  let url = params.transNo ? purchase : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken,
  })
}
