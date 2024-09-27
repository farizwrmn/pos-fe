import { request, config, crypt } from '../../utils'

const { apiStores } = config.rest

export async function getAllStores (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    alt: true,
    url: apiStores,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function getStore (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/list/stores',
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function addStore (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: apiStores,
    alt: true,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function showStore (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiStores}/id/${params.id}`,
    method: 'get',
    alt: true,
    headers: apiHeaderToken
  })
}

export async function updateStore (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiStores}/${params.id}`,
    alt: true,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}
