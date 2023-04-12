import { v4 as uuidv4 } from 'uuid'
import { request, config, crypt, lstorage } from '../utils'
// const { apiURL, apiPrefix, api } = config
const { pos, posdetail } = config.api


// export async function queryLastTransNo (params) {
//   const apiHeaderToken = crypt.apiheader()
//   const url = pos + '/last'
//   return request({
//     url: url,
//     method: 'get',
//     headers: apiHeaderToken
//   })
// }

export async function queryList (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/pos-detail',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  const storeId = lstorage.getCurrentUserStore()
  params.storeId = storeId
  const url = pos
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPaymentPos (params) {
  const apiHeaderToken = crypt.apiheader()
  const storeId = lstorage.getCurrentUserStore()
  params.storeId = storeId
  const url = '/payment/pos'
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPos (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${pos}/code/${encodeURIComponent(params.id)}`
  return request({
    url,
    method: 'get',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${pos}/header/${params.id}`
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `${posdetail}/${encodeURIComponent(params.id)}`
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryDetailConsignment (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `/posconsignment/${encodeURIComponent(params.id)}`
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function create (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${pos}/code/${encodeURIComponent(params.transNo)}?uuid=${uuidv4()}`
  return request({
    url,
    method: 'post',
    data: JSON.stringify(params),
    body: JSON.stringify(params),
    headers: apiHeaderToken
  })
}

export async function createDetail (params) {
  const url = `${posdetail}/${encodeURIComponent(params.transNo)}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}
// when void an Invoice
export async function updatePos (params) {
  const url = params ? `${pos}/code/${encodeURIComponent(params.transNo)}` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function updatePosHeader (params) {
  const url = pos
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}
