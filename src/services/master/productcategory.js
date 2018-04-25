import { request, config, crypt } from '../../utils'

const { stockcategory } = config.api

export async function queryCode (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${stockcategory}/${encodeURIComponent(params.categoryCode)}`
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: stockcategory,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${stockcategory}/${encodeURIComponent(params.id)}` : stockcategory
  return request({
    url,
    method: 'post',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${stockcategory}/${encodeURIComponent(params.id)}` : stockcategory
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${stockcategory}/${encodeURIComponent(params.id)}` : stockcategory
  return request({
    url,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}
