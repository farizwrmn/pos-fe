import { request, crypt } from 'utils'

const division = '/employees-division'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: division,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const url = params.id ? `${division}/${params.id}` : null
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
  const url = `${division}/${encodeURIComponent(params.id)}`
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
  const url = params.id ? `${division}/${encodeURIComponent(params.id)}` : division
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'delete',
    data: params.data,
    headers: apiHeaderToken
  })
}
