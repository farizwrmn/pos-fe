import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/pos-unlock',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/pos-unlock',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
