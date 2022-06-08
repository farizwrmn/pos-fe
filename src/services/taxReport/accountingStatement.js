import { request, crypt } from 'utils'

export async function queryProfitLoss (params = {}) {
  // eslint-disable-next-line eqeqeq
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/tax-report-accounting/profit-loss',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryBalanceSheet (params = {}) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/tax-report-accounting/balance-sheet',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
