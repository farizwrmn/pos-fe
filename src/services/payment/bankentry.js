import { request, config, crypt } from '../../utils'

const { cashier } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  params.order = 'typeCode'
  return request({
    url: `${cashier}/bankentry`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/bankentry`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function transfer (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/bankentry/transfer`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/bankentry/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/bankentry/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

