import { request, crypt } from 'utils'

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/procurement-purchase-price/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-purchase-price',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-purchase-price',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
