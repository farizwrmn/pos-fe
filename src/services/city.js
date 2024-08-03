import { request, config, crypt } from 'utils'

const { city } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: city,
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const url = params.cityCode ? `${city}/${params.cityCode}` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params,
    alt: true,
    body: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const url = `${city}/${encodeURIComponent(params.cityCode)}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params,
    alt: true,
    body: params,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const url = params.id ? `${city}/${encodeURIComponent(params.id)}` : city
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'delete',
    alt: true,
    data: params.data,
    headers: apiHeaderToken
  })
}
