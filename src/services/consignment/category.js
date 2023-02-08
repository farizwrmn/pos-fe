import { request, crypt } from 'utils'
import { rest } from 'utils/config.company'

export async function query () {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/categories/get`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryAdd (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/categories/add`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryEdit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/categories/edit`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
