import { request, config, crypt, lstorage } from '../utils'

const { purchase, purchaseDetail } = config.api

export async function query (params) {
  params.storeId = lstorage.getCurrentUserStore()
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: purchase,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryDetail (params) {
  params.storeId = lstorage.getCurrentUserStore()
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: purchaseDetail,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function create (params) {
  const storeId = lstorage.getCurrentUserStore()
  params.data.storeId = storeId
  let url = params.id ? purchase : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function createDetail (params) {
  let url = params.id ? `${purchaseDetail}/purchase` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function createVoidDetail (params) {
  let url = params.id ? `${purchaseDetail}/void` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  let url = params.id !== null ? purchaseDetail : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function editPurchase (params) {
  let url = params.id !== null ? purchase : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  let url = params.transNo ? purchase : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryHistories (params) {
  const apiHeaderToken = crypt.apiheader()
  const storeId = lstorage.getCurrentUserStore()
  params.storeId = storeId
  return request({
    url: purchase,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryHistory (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${purchase}/transNo/${params.transNo}`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryHistoryDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: purchaseDetail,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
