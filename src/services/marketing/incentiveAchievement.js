import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/incentive-achievement',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
