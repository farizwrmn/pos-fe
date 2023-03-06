import { request, crypt } from 'utils'
import { rest } from 'utils/config.company'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/admin`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryAdd (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/admin/add`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryEdit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/admin/edit`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryResetPassword (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/admin/edit-password`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
