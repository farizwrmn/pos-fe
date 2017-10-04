import { request, config, crypt } from 'utils'

const { customertype } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: customertype,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function add (params) {
  const url = params.typeCode ? `${customertype}/${encodeURIComponent(params.typeCode)}` : customertype
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken,
  })
}

export async function edit (params) {
  const url = params.typeCode ? `${customertype}/${encodeURIComponent(params.typeCode)}` : customertype
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
  const url = params.id ? `${customertype}/${encodeURIComponent(params.id)}` : customertype
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken,
  })
}
