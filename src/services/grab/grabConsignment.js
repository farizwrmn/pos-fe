import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/grab-consignment-product',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryProduct (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/grab-consignment-find',
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/grab-consignment-product',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function updateCategory (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/grab-consignment-category',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function updateValidate (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/grab-consignment-validate',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/grab-consignment-product/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/grab-consignment-product/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
