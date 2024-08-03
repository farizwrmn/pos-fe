import { request, config, crypt } from '../../utils'

const { cashier } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/counters`,
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/counters`,
    alt: true,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/counters/${id}`,
    alt: true,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/counters/${params.id}`,
    method: 'put',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}
