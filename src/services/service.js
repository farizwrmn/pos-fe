import { request, config, crypt } from 'utils'

const { services } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: services,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function queryServiceByCode (params) {
  const url = params.serviceCode? services + '/' + encodeURIComponent(params.serviceCode) : services + '/' + encodeURIComponent(params)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function add (params) {
  const url = params.serviceCode ? services + '/' + encodeURIComponent(params.serviceCode) : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url:url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken,
  })
}

export async function edit (params) {
  const url = `${services}/${encodeURIComponent(params.serviceCode)}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken,
  })
}

export async function remove (params) {
  const url = params.id.serviceCode ? `${services}/${params.id.serviceCode}` : services
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'delete',
    data: params.data,
    headers: apiHeaderToken,
  })
}
