import { request, crypt } from 'utils'
import { rest } from 'utils/config.company'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/vendor-commission`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
