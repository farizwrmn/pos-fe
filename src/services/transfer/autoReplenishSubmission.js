import { request, crypt } from 'utils'

export async function queryDeliveryOrder (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/auto-replenish-delivery-order',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/auto-replenish-submission',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryHeader (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/auto-replenish-header',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/auto-replenish-submission',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/auto-replenish-submission/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/auto-replenish-submission/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
