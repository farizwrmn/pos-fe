import { request, config, crypt } from '../../utils'

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
  const url = params.memberCode  ? customers + '/' + encodeURIComponent(params.memberCode) : customers + '/' + encodeURIComponent(params.data.memberCode)
  console.log(url)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function queryUnits (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params ? customers + '/' + params.memberCode + '/units' : customers
  return request({
    url: url,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${customers}/${encodeURIComponent(params.id)}` : customers
  return request({
    url: url,
    method: 'post',
    data: params.data,
    headers: apiHeaderToken,
  })
}

export async function addUnit (params) {
  const apiHeaderToken = crypt.apiheader()
  console.log('paramsadd', params)
  const url = params ? customers + '/' + params.memberCode + '/units/' + params.policeNo : customers
  return request({
    url: url,
    method: 'post',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${customers}/${encodeURIComponent(params.id)}` : customers
  return request({
    url: url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function removeUnit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? customers + '/' + params.memberCode + '/units/' + params.id : customers
  return request({
    url: url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function edit (params) {
  console.log(params, 'params')
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? customers + '/' + params.id : customers
  return request({
    url: url,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken,
  })
}

export async function editUnit (params) {
  console.log(params, 'params')
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? customers + '/' + params.code + '/units/' + params.id : customers
  return request({
    url: url,
    method: 'put',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function editPoint (params) {
  const url = params.memberCode ? `${customers}/${encodeURIComponent(params.memberCode)}/points` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'put',
    data: params,
    headers: apiHeaderToken,
  })
}