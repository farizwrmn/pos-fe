import { request, config, crypt, lstorage } from 'utils'

const { transfer } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeIdReceiver = lstorage.getCurrentUserStore()
  params.status = 0
  return request({
    url: `${transfer}/out`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryCost (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${transfer}/out/cost`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryLov (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${transfer}/out`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function editPrice (params) {
  let url = `${transfer}/out-edit-price`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function queryHpokok (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  params.active = 1
  return request({
    url: `${transfer}/hpokok/out/detail`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryChangeHpokokTransferOut (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  params.active = 1
  return request({
    url: `${transfer}/hpokok/out/change`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryByTrans (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${transfer}/out/code`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryByTransReceive (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${transfer}/out/receive`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${transfer}/out/detail`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPrice (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${transfer}/out-hpokok`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPriceList (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${transfer}/out-hpokok-list`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function postTrans (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${transfer}/out-post-trans`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  let url = `${transfer}/out`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function queryTransferOut (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: params ? `${transfer}/out` : transfer,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function voidTrans (params) {
  let url = `${transfer}/out/cancel`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function updateTransferOutHpokok (params) {
  let url = `${transfer}/out/detail/${params.id}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    headers: apiHeaderToken
  })
}
