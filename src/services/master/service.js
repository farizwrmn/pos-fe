import { request, config, crypt } from '../../utils'

const { services, misc } = config.api

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${services}/${params.id}`,
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: services,
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryServiceType (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${misc}/code/SERVICE`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryServiceByCode (params) {
  const url = params.serviceCode ? `${services}/${encodeURIComponent(params.serviceCode)}` : `${services}/${encodeURIComponent(params)}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${services}/${params.id}` : services
  return request({
    url,
    method: 'post',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${services}/:id` : services
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${services}/${params.id}` : services
  return request({
    url,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}
