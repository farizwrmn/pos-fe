import { request, config, crypt } from '../../utils'

const { cashier } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/users`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/users`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/users/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/users/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryInformation (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/users/${params}/periods/O`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function cashRegister (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/cashregisters`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
