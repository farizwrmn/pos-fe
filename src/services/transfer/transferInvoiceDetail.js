import { request, crypt } from '../../utils'

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/transfer-invoice-detail/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/transfer-invoice-detail',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryId (params) {
  const apiHeaderToken = crypt.apiheader()
  params.order = 'typeCode'
  return request({
    url: `/transfer-invoice-detail/${params.id}`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/transfer-invoice-detail',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/transfer-invoice-detail/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/transfer-invoice-detail/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

