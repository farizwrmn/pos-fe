import { request, config, crypt, lstorage } from '../utils'

const { adjust, adjustDetail } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  params = {
    storeId: lstorage.getCurrentUserStore()
  }
  return request({
    url: adjust,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: adjustDetail,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function create (params) {
  let url = params.id ? `${adjust}/code/${encodeURIComponent(params.id)}` : null
  params.storeId = lstorage.getCurrentUserStore()
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function createDetail (params) {
  let url = params.id ? `${adjustDetail}/purchase` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  // let url = params.id ? `${adjust}/${encodeURIComponent(params.id)}` : null
  let url = adjustDetail
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function posting (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/adjustposting',
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  let url = params.id ? `${adjust}/${encodeURIComponent(params.id)}` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}
