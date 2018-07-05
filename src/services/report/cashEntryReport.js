import { request, config, crypt, lstorage } from 'utils'

const { cashEntryReport } = config.api

export async function queryTrans (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  params.status = 1
  return request({
    url: `${cashEntryReport}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${cashEntryReport}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
