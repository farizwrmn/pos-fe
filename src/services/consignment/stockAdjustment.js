
import { request, crypt } from 'utils'
import { rest } from 'utils/config.company'

export function query (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/stock-adjustment/get`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}

export function insertData (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/stock-adjustment/add`,
    method: 'post',
    data,
    headers: apiHeaderToken
  })
}
