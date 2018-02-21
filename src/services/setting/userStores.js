import { request, config, crypt } from 'utils'

const { apiStores, apiUserStore } = config.rest

export async function getAllStores () {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: apiStores,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function getUserStores (params) {
  const url = apiUserStore.replace('/:id', `/${params.userId}`)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function saveUserDefaultStore (params) {
  const url = apiUserStore.replace('/:id', `/${params.userId}`)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function saveUserStore (params) {
  const url = apiUserStore.replace('/:id', `/${params.userId}`)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}
