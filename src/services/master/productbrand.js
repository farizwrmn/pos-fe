import { request, config, crypt } from '../../utils'

const { brand } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: brand,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${brand}/${encodeURIComponent(params.id)}` : brand
  return request({
    url,
    method: 'post',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${brand}/${encodeURIComponent(params.id)}` : brand
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${brand}/${encodeURIComponent(params.id)}` : brand
  return request({
    url,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}
