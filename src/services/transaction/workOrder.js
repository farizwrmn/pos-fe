import { request, config, crypt } from 'utils'

const { workOrder } = config.api

export async function queryWOCustomFields (params) {
  const apiHeaderToken = crypt.apiheader()
  params.order = 'sortingIndex'
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
