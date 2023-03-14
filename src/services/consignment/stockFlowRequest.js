import { request, crypt } from 'utils'
import { rest } from 'utils/config.company'

export function query (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/stock-flow-request/get`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}

export function queryDetail (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/stock-flow-request/get-by-id`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}

export function queryPending (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/stock-flow-request/pending`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}

export function insertData (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/stock-flow-request/add`,
    method: 'post',
    data,
    headers: apiHeaderToken
  })
}

export function approve (data) {
  const id = data.id
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/stock-flow-request/approve/${id}`,
    method: 'put',
    data,
    headers: apiHeaderToken
  })
}

export function reject (data) {
  const id = data.id
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/stock-flow-request/reject/${id}`,
    method: 'put',
    data,
    headers: apiHeaderToken
  })
}
