import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-receive',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryId (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/procurement-receive/${params.id}`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function querySupplier (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-receive-request/supplier',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-receive',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/procurement-receive/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/procurement-receive/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
