import { request, crypt, lstorage } from 'utils'

export async function queryPosPayment (params = {}) {
  params.storeId = lstorage.getCurrentUserStore()
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/report/pos-payment',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
