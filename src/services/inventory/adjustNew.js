import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/adjust-new',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
