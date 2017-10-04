import { request, config, crypt } from 'utils'

const { customergroup } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: customergroup,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function add (params) {
  const url = params.groupCode ? `${customergroup}/${encodeURIComponent(params.groupCode)}` : customergroup
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
  const url = params.groupCode ? `${customergroup}/${encodeURIComponent(params.groupCode)}` : customergroup
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
  const url = params.id.groupCode ? `${customergroup}/${encodeURIComponent(params.id.groupCode)}` : customergroup
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'delete',
    data: params.data,
    headers: apiHeaderToken,
  })
}
