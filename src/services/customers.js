import { request, config, crypt } from 'utils'

const { customers } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: customers,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function queryByCode (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: customers + '/' + params.memberCode,
    method: 'get',
    headers: apiHeaderToken,
  })
}

export async function add (params) {
  const url = params.id ? `${customers}/${params.id}` : customers
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken,
  })
}

export async function edit (params) {
  const url = params.id ? `${customers}/${params.id}` : customers
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken,
  })
}

export async function remove (params) {
  const url = params.id ? `${customers}/${params.id}` : customers
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'delete',
    data: params.data,
    headers: apiHeaderToken,
  })
}
