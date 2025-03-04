import { request, crypt } from 'utils'

export async function queryGrabmartCode (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/grabmart-code',
    alt: true,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryExpressCode (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/express-code',
    alt: true,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
