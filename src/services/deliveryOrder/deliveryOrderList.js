import { request, crypt, lstorage } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: '/delivery-order',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
