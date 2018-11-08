import { request, config, crypt } from '../utils'

const { role, permission, permissionrole } = config.api

export async function queryRole (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: role,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryList (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: permission,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: permissionrole,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: permissionrole,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}
