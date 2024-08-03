import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/incentive-achievement',
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}
