import { request, config, crypt } from 'utils'

const { importstock, adjust } = config.api

export async function queryCode (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/stocks/import/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/stocks/import',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: importstock,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function opnameStock (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${adjust}/opname`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function cancelOpname (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/opname-cancel',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function executeList (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/stocks/import/execute/${params.storeId}`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
