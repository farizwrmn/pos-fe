import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/notification-stake',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/notification-stake',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/notification-stake/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/notification-stake/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
