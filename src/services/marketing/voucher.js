import { request, crypt } from 'utils'

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/marketing-voucher/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/marketing-voucher',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function validateVoucher (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/marketing-voucher-validate/${params.code}`,
    alt: true,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/marketing-voucher',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function addPayment (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/marketing-voucher-payment',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/marketing-voucher/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/marketing-voucher/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
