import { request, crypt } from 'utils'

export async function queryTrans (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/payable-report/trans',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}


export async function querySupplier (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/payable-report/supplier',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
