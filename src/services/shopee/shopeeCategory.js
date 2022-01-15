import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/shopee/category',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
