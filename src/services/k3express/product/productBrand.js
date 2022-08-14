import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/k3express/product-brand',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/k3express/product-brand',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/k3express/product-brand/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/k3express/product-brand/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
