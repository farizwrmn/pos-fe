import { request, crypt } from 'utils'
import lstorage from 'utils/lstorage'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/purchase-order',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPurchaseOrder (params) {
  params.storeId = lstorage.getCurrentUserStore()
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/purchase-order-active',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/purchase-order/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/purchase-order',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function approve (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/purchase-order/approve/${params.id}`,
    method: 'post',
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/purchase-order/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/purchase-order/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
