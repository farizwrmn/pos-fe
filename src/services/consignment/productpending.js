import { request, crypt } from 'utils'
import { rest } from 'utils/config.company'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/product-pending/get`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryApprove (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/product-pending/approve`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryReject (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/product-pending/reject`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

