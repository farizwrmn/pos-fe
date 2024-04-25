import { request, crypt } from 'utils'

const contractType = '/employees-contract-type'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: contractType,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const url = params.id ? `${contractType}/${params.id}` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const url = `${contractType}/${encodeURIComponent(params.id)}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const url = params.id ? `${contractType}/${encodeURIComponent(params.id)}` : contractType
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'delete',
    data: params.data,
    headers: apiHeaderToken
  })
}
