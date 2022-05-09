import { request, crypt } from 'utils'

export async function queryGrabmartCode (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/grabmart-code',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
