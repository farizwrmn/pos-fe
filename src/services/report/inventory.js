import { request, config, crypt, lstorage } from '../../utils'

const { inventoryreport } = config.api

export async function queryInventoryTransferIn (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${inventoryreport}/in`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryInventoryTransferOut (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${inventoryreport}/out`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryInventoryInTransit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${inventoryreport}/intransit`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
