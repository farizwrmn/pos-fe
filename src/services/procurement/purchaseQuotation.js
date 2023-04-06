import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-quotation',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryCount (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-quotation-request/trans',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function querySupplierCount (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-quotation-request/supplier',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-quotation',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/procurement-quotation/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/procurement-quotation/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
