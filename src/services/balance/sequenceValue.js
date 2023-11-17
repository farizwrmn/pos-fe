import { request, crypt } from '../../utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/sequence-value',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function create (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/sequence-value',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

