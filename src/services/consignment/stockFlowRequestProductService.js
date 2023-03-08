import { request, crypt } from 'utils'
import { rest } from 'utils/config.company'

export function queryById (data) {
  const id = data.id
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/stock-flow-request-product/get/${id}`,
    method: 'get',
    headers: apiHeaderToken
  })
}
