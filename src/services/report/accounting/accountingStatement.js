import { request, crypt } from 'utils'

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

export async function queryProfitLossDetailStore (params = {}) {
  // eslint-disable-next-line eqeqeq
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/report/accounting/profit-loss-store',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryBalanceSheet (params = {}) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/report/accounting/balance-sheet',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryBalanceSheetDetailStore (params = {}) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/report/accounting/balance-sheet-store',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryCashFlow (params = {}) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/report/accounting/cash-flow',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
