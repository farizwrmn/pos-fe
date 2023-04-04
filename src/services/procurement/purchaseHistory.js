import { request, crypt } from 'utils'

export async function querySupplierHistory (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-history/supplier',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPurchaseHistory (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-history/purchase',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPurchaseOrderProduct (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-history/order',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryStockProcurement (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/procurement-history/stock',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
