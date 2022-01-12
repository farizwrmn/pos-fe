import { request, crypt } from 'utils'

export async function login (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/shopee-api/login',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
