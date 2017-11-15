import { request, config, crypt } from 'utils'
const { stock, fiforeport } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: stock,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPOSstock (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${fiforeport}/balance`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryProductByCode (params) {
  let url = `${stock}/${encodeURIComponent(params)}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function add (params) {
  let url = params.id ? stock + '/' + encodeURIComponent(params.id) : stock
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
  let url = params.id ? stock + '/' + encodeURIComponent(params.id) : stock
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
  let url = params.id ? stock + '/' + encodeURIComponent(params.id) : stock
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}
