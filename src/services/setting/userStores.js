import { request, config, crypt } from 'utils'

const { apiStores, apiListStores, apiUserStore, apiUserTargetStore, apiTargetStores, apiListTargetStores } = config.rest

export async function getAllStores () {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: apiStores,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function getAllTargetStores () {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: apiTargetStores,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function getListStores (params) {
  const apiHeaderToken = crypt.apiheader()
  params.type = 'all'
  params.field = 'id,storeCode,storeName,settingValue'
  params.storeParentId = null
  return request({
    url: apiListStores,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function getListTargetStores (params) {
  const apiHeaderToken = crypt.apiheader()
  params.type = 'all'
  params.field = 'id,storeCode,storeName,settingValue'
  params.storeParentId = null
  return request({
    url: apiListTargetStores,
    method: 'get',
    data: params,
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


export async function getUserTargetStores (params) {
  const url = apiUserTargetStore.replace('/:id', `/${params.userId}`)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'get',
    data: params.data,
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

export async function saveUserTargetStore (params) {
  const url = apiUserTargetStore.replace('/:id', `/${params.userId}`)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}
