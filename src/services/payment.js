import { request, config, crypt } from '../utils'
// const { apiURL, apiPrefix, api } = config
const { pos, posdetail } = config.api


export async function queryLastTransNo (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = pos + '/last'
  console.log('url', url)
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = pos
  console.log(url)
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryPos (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = pos + '/' + 'code' + '/' + params
  console.log(url)
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${posdetail}/${params.id}`
  console.log(url)
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken,
  })
}

export async function create (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: pos + '/code/' + params.transNo,
    method: 'post',
    data: JSON.stringify(params),
    body: JSON.stringify(params),
    headers: apiHeaderToken
  })
}

export async function createDetail (params) {
  console.log('createDetail', params);
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: posdetail + '/' + params.transNo,
    method: 'post',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}

export async function updatePos (params) {
  const url = params ? `${pos}/code/${encodeURIComponent(params.transNo)}` : null
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
