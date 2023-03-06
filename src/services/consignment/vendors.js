import { request, crypt } from 'utils'
import { rest } from 'utils/config.company'

export async function queryById (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/vendors/get/${id}`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryByName (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/vendors/get/${id}`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/vendors/get`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function querySearch (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/vendors/get-query`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}

export async function queryAdd (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/vendors/add`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryEdit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/vendors/edit`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryLast () {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/vendors/get-last`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryResetPassword (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/vendors/edit-password`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
