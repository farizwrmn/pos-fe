/**
 * Created by Veirry on 10/09/2017.
 */
import { request, config, crypt, lstorage } from '../../utils'

const { pos, posReport, posreport, woReport } = config.api

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

export async function queryEmbeddedUrl (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: '/embedded-url',
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

export async function queryDate (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `${posreport}/date`
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryHourly (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `${posReport}/hourly`
  return request({
    url,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryHour (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `${posReport}/hour`
  return request({
    url,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryInterval (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `${posReport}/interval`
  return request({
    url,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryByDate (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${posReport}/bydate`
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryAll (params) {
  const apiHeaderToken = crypt.apiheader()
  if (!params.storeId) {
    params.storeId = lstorage.getCurrentUserStore()
  }
  const url = `${posreport}/all`
  return request({
    url,
    data: params,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryWoDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  if (!params.storeId) {
    params.storeId = lstorage.getCurrentUserStore()
  }
  const url = `${woReport}/detail`
  return request({
    url,
    data: params,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryWoCheck (params) {
  const apiHeaderToken = crypt.apiheader()
  if (!params.storeId) {
    params.storeId = lstorage.getCurrentUserStore()
  }
  params.type = 'all'
  params.field = 'id,storeId,woNo,woDate,transNo,transDate,categoryCode,categoryName,value,valueName,memo,memberId,memberCode,memberName,memberTypeName,policeNoId,policeNo'
  const url = `${woReport}/check`
  return request({
    url,
    data: params,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryAllGroup (params) {
  const apiHeaderToken = crypt.apiheader()
  if (!params.storeId) {
    params.storeId = lstorage.getCurrentUserStore()
  }
  const url = `${posreport}/allgroup`
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

export async function queryTurnOver (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${posReport}/turnover`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPOSCompareSvsI (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${posReport}/compare`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
