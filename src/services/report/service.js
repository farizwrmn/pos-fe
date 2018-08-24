/**
 * Created by Veirry on 18/09/2017.
 */
import { request, config, crypt, lstorage } from '../../utils'

const { servicereport } = config.api

export async function queryDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `${servicereport}/detail`
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `${servicereport}/trans`
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryMechanic (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `${servicereport}/mechanic`
  return request({
    url,
    data: params,
    method: 'get',
    headers: apiHeaderToken
  })
}
