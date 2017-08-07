import { request, config, crypt } from 'utils'

const { customers } = config.api

export async function query (params) {
  const url = params ? `${customers}/${params.id}/` + 'units' : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'get',
    // data: params,
    headers: apiHeaderToken,
  })
}

export async function queryField (member, params) {
  const url = params ? `${customers}/${member.code}/` + 'units' : null
  console.log('url', url)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const url = params.id ? `${customers}/${params.data.memberCode}/` + 'units' + `/${params.id}` : null
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
  const url = params.id ? `${customers}/${params.data.memberCode}/` + 'units' + `/${params.id}` : null
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
  const url = params.id ? `${customers}/${params.id.data}/` + 'units' + `/${params.id.id}` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'delete',
    data: params.data,
    headers: apiHeaderToken,
  })
}
