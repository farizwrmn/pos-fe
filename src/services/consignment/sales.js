import { request, crypt } from 'utils'
import { rest } from 'utils/config.company'

export function query (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/sales/get`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}

export function queryChart (data) {
  console.log('data', data)
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/dashboard/sales`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}

export function querySummary (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/dashboard/sales-summary`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}

export function queryNumberList (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/sales/get-id`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}

export function queryByCode (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/sales/get-by-code`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}
