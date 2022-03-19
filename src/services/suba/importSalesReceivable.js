import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/suba/import-sales-receivable',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/suba/import-sales-receivable',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function executeList (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/suba/import-sales-receivable/execute',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function cancelOpname (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/suba/import-sales-receivable/cancel',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
