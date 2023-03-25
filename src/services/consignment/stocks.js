import { request, crypt } from 'utils'
import { rest } from 'utils/config.company'

export async function query (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/stock/get`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}

export async function queryAll (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/stock/get-all`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}
