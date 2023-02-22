import { request, crypt } from 'utils'
import { rest } from 'utils/config.company'

export async function query (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/return/get`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}

export async function queryReport (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/return/report`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}

export function queryById (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/return/get/${id}`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export function insertData (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/return/add`,
    method: 'post',
    data,
    headers: apiHeaderToken
  })
}

export function approveData (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/return/approve`,
    method: 'put',
    data,
    headers: apiHeaderToken
  })
}

export function rejectData (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/return/reject`,
    method: 'put',
    data,
    headers: apiHeaderToken
  })
}
