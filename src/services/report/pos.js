/**
 * Created by Veirry on 10/09/2017.
 */
import { request, config, crypt, lstorage } from '../../utils'

const { pos, posReport, posreport } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = posreport
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryTrans (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `${posreport}/trans`
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryAll (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `${posreport}/all`
  return request({
    url,
    data: params,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryTransCancel (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `${posreport}/trans/cancel`
  return request({
    url,
    data: params,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryPosDaily (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `${posReport}/daily`
  return request({
    url,
    data: params,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryCustomerHistory (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${posReport}/unit`
  return request({
    url,
    data: params,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryCustomerAsset (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${posReport}/member/assets`
  return request({
    url,
    data: params,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryPOS (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: pos,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPOSDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${posReport}/detail`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
