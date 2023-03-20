import { request, crypt } from 'utils'
import { rest } from 'utils/config.company'

export async function query (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/cut-off/get`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}

export async function queryallCutOff (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/cut-off/get-all`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPeriodList () {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/cut-off/get-period-list`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryLast () {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/cut-off/get-last`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryPeriod (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/cut-off/get-period`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryAdd (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/cut-off/add`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
