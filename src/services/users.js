import { request, config, crypt } from 'utils'

const { apiUsers, apiUserTotp, apiUserTotpr } = config.rest

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: apiUsers,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const url = params.id ? `${apiUsers}/${params.id}` : apiUsers
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const url = params.id ? `${apiUsers}/${params.id}` : apiUsers
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const url = params.id ? `${apiUsers}/:id` : apiUsers
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function totp (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: (params.mode === 'generate') ? apiUserTotpr : apiUserTotp,
    method: 'get',
    data: { id: params.id, mode: params.mode },
    headers: apiHeaderToken
  })
}
