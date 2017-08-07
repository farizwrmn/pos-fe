import { request, config, crypt } from 'utils'

const { suppliers } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: suppliers,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function add (params) {
  const url = params.supplierCode ? `${suppliers}/${params.supplierCode}` : suppliers
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
  const url = params.supplierCode ? `${suppliers}/${params.supplierCode}` : suppliers
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
  const url = params.id ? `${suppliers}/${params.id}` : suppliers
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken,
  })
}
