import { request, crypt, lstorage } from 'utils'

export async function queryProfitLoss (params = {}) {
  // eslint-disable-next-line eqeqeq
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/report/accounting/profit-loss',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryBalanceSheet (params = {}) {
  params.storeId = lstorage.getCurrentUserStore()
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/report/accounting/balance-sheet',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryCashFlow (params = {}) {
  params.storeId = lstorage.getCurrentUserStore()
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/report/accounting/cash-flow',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
