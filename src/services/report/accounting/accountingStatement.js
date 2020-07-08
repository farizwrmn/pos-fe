import { request, crypt, lstorage } from 'utils'

export async function queryProfitLoss (params = {}) {
  params.storeId = lstorage.getCurrentUserStore()
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/report/accounting/profit-loss',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
