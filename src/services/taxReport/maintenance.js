import { request, crypt } from 'utils'

export async function queryPos (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/tax-report/maintenance-sales',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPurchase (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/tax-report/maintenance-purchase',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
