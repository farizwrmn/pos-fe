import { request, config, crypt, lstorage } from 'utils'

const { transfer } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${transfer}/in`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${transfer}/in/detail`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryTrans (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${transfer}/in/code`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
export async function queryChangeHpokokTransferIn (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  params.active = 1
  return request({
    url: `${transfer}/hpokok/in/change`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function updateTransferInHpokok (params) {
  let url = `${transfer}/in/detail/${params.id}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    headers: apiHeaderToken
  })
}

export async function add (params) {
  let url = `${transfer}/in`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function voidTrans (params) {
  let url = `${transfer}/in/cancel`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}
