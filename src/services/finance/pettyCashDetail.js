import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/petty-cash-detail',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/petty-cash/${params.id}`,
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryActive (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/petty-cash-active',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryEmployee (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/petty-cash-employee',
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/petty-cash-detail',
    method: 'post',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function editOption (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/petty-cash-detail-option',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/petty-cash-detail/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/petty-cash-detail/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
