import { request, crypt } from 'utils'

export async function queryDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/delivery-order/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
