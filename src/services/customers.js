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
  const url = params.memberCode ? customers + '/' + params.memberCode : customers + '/' + params
  console.log('queryByCode', url);
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    data: params,
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
  console.log('edit-params', params)
  const url = params.id ? `${customers}/${params.id}` : customers
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params.data ? params.data : JSON.stringify(params.point),
    body: params.data ? params.data : JSON.stringify(params.point),
    headers: apiHeaderToken,
  })
}

export async function editPoint (params) {
  const url = params.memberCode ? `${customers}/${params.memberCode}/points` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'put',
    data: params,
    body: params,
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
