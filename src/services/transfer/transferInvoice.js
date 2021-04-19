import { request, lstorage, crypt } from '../../utils'

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `/transfer-invoice/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  params.order = 'typeCode'
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: '/transfer-invoice',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryId (params) {
  const apiHeaderToken = crypt.apiheader()
  params.order = 'typeCode'
  return request({
    url: `/transfer-invoice/${params.id}`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function addPayment (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/transfer-invoice-payment/${params.id}`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/transfer-invoice',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/transfer-invoice/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function payment (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/transfer-invoice-payment/${params.id}`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/transfer-invoice/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

