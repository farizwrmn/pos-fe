import { request, crypt, lstorage } from 'utils'

export async function query (params) {
  params.storeId = lstorage.getCurrentUserStore()
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/return-sales-detail',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryById (id, params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/return-sales-detail/${id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
