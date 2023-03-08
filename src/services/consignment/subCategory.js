import { request, crypt } from 'utils'
import { rest } from 'utils/config.company'

export async function query () {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/sub-categories/get`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryAdd (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/sub-categories/add`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryEdit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/sub-categories/edit`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
