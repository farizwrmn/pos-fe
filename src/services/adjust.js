import { request, config, crypt } from '../utils'
const { adjust, adjustDetail } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
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
  console.log(url)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken,
  })
}

export async function createDetail (params) {
  let url = params.id ? `${adjustDetail}/purchase` : null
  console.log(url)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  let url = params.id ? `${adjust}/${encodeURIComponent(params.id)}` : null
  console.log(url)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  console.log('delete-params:');
  let url = params.id ? `${adjust}/${encodeURIComponent(params.id)}` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}
