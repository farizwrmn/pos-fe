import { request, crypt } from '../../utils'

export async function queryCode (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/account-default/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/account-default',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/account-default/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/account-default',
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
