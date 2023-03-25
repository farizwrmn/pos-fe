import { request, crypt } from 'utils'

export async function queryId (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/account-rule/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/account-rule',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/account-rule',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
