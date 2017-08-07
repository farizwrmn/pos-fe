import { request, config, crypt } from 'utils'

const { users } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: users,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function add (params) {
  const url = params.id ? users + '/' + params.id  : users
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'post',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const url = params.id ? users + '/' + params.id  : users
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'put',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const url = params.id ? `${users}/:id` : users
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken,
  })
}
