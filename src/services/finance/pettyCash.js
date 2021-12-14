import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/petty-cash',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryOption (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/petty-cash-option',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/petty-cash',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function addCashEntry (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/petty-cash-entry',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function editOption (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/petty-cash-option',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/petty-cash/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/petty-cash/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
