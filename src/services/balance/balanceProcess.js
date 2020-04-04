import { request, crypt } from '../../utils'

export async function getActive (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/active/balance',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function open (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/open/balance',
    method: 'post',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function closed (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/close/balance',
    method: 'post',
    data: params.data,
    headers: apiHeaderToken
  })
}
