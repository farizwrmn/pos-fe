import { request, crypt } from 'utils'

export async function getProductDetail (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/k3express/product-consignment/get-detail',
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/k3express/product-consignment',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/k3express/product-consignment',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/k3express/product-consignment/edit/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/k3express/product-consignment/delete/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

