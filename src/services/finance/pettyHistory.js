import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/petty-history',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function closing (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/petty-cash-closing',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
