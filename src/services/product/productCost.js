import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/product-cost',
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function querySupplier (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/product-cost-supplier',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
