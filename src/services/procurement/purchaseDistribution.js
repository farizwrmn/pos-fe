import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-distribution',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryDC (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-distribution-center',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryStore (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-distribution-store',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-distribution',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/procurement-distribution/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/procurement-distribution/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
