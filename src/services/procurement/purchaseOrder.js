import { request, crypt } from 'utils'

export async function queryCount (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-order-request/trans',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function querySupplierCount (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-order-request/supplier',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function querySupplierDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/procurement-order-request/supplier/${params.transId}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-order',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-order',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/procurement-order/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/procurement-order/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
