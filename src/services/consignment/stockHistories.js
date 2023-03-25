import { request, crypt } from 'utils'
import { rest } from 'utils/config.company'

export function query (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/stock-histories/get`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}
