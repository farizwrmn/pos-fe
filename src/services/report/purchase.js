/**
 * Created by Veirry on 19/09/2017.
 */
import { request, config, crypt, lstorage } from '../../utils'

const { purchasereport, adjustreport } = config.api

export async function queryTrans (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `${purchasereport}/trans`
  return request({
    url,
    data: params,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryReturn (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${adjustreport}/out/return`
  return request({
    url,
    data: params,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryPurchaseDaily (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `${purchasereport}/daily`
  return request({
    url,
    data: params,
    method: 'get',
    headers: apiHeaderToken
  })
}
