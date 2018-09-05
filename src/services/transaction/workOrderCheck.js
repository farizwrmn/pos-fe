import { request, config, crypt, lstorage } from 'utils'

const { workOrder } = config.api

export async function queryWoCheck (params) {
  const apiHeaderToken = crypt.apiheader()
  params.type = 'all'
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${workOrder}/check`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryWODetail (params) {
  const apiHeaderToken = crypt.apiheader()
  params.type = 'all'
  return request({
    url: `${workOrder}/detail`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
