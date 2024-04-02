import { request, crypt } from 'utils'

/*
params:
  storeName
  transDate
*/
export async function queryListVoidEdcDeposit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/void-edc-deposit',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
export async function insertVoidEdcDeposit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/void-edc-deposit',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/physical-money/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/physical-money',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryAll (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/physical-money-all',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/physical-money',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/physical-money/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/physical-money/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
