import { request, config, crypt, lstorage } from 'utils'

const { workOrder } = config.api

export async function queryWOCustomFields (params) {
  const apiHeaderToken = crypt.apiheader()
  params.type = 'all'
  return request({
    url: `${workOrder}/field`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function addWOCustomFields (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${workOrder}/field`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function addWorkOrderHeader (params) {
  params.header.storeId = lstorage.getCurrentUserStore()
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${workOrder}/main/header`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function addWorkOrderDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${workOrder}/main/detail`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}


export async function editWOCustomFields (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${workOrder}/field/${params.id}`,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function deleteWOCustomFields (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${workOrder}/field/${params.id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function queryWOCategory (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${workOrder}/category`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function addWOCategory (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${workOrder}/category`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function deleteWOCategory (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${workOrder}/category/${params.id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function queryWOHeader (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  params.order = '-createdAt'
  return request({
    url: `${workOrder}/header`,
    method: 'get',
    data: params,
    alt: true,
    headers: apiHeaderToken
  })
}

export async function addWOHeaderAndChecklist (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${workOrder}/main/header`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  if (!params.id) return
  const apiHeaderToken = crypt.apiheader()
  const url = `${workOrder}/header/${params.id}`
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}
