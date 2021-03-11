import { request, crypt } from '../../utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/master/marketplace-product',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/master/marketplace-product',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/master/marketplace-product/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/master/marketplace-product/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
