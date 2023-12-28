import { request, crypt } from 'utils'

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/express-store/${params.storeId}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/express-store',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
