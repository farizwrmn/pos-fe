import { request, config, crypt } from 'utils'

const { stores, userStore } = config.api

export async function getAllStores() {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: stores,
    method: 'get',
    headers: apiHeaderToken,
  })
}

export async function getUserStores(params) {
  const url = userStore.replace('/:id', '/' + params.userId)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken,
  })
}

export async function saveUserDefaultStore (params) {
  const url = userStore.replace('/:id', '/' + params.userId)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function saveUserStore (params) {
  const url = userStore.replace('/:id', '/' + params.userId)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}