import { request, config, crypt, lstorage } from 'utils'
const { cashierList, cashierTrans } = config.api

export async function getCashierNo () {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: cashierList,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function getCashierTrans (params) {
  const defaultStore = lstorage.getCurrentUserStore()
  const url = cashierTrans + '/' + params.cashierId + '/' + params.cashierNo + '/' + params.shift + '/' + params.status + '/' + defaultStore
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function createCashierTrans (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: cashierTrans,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function updateCashierTrans (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: cashierTrans,
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}
