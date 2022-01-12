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

export async function setCode (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/shopee-api/set-code',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
