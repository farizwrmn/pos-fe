import { request, lstorage, config, crypt } from '../../utils'

const { cashier } = config.api

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${cashier}/cashentry/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  params.order = 'typeCode'
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${cashier}/cashentry`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryId (params) {
  const apiHeaderToken = crypt.apiheader()
  params.order = 'typeCode'
  return request({
    url: `${cashier}/cashentry/${params.id}`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/cashentry`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/cashentry/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/cashentry/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

