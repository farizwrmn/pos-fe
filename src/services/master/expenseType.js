import { request, config, crypt } from '../../utils'

const { cashier } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  params.order = 'typeCode'
  return request({
    url: `${cashier}/expensetype`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/expensetype`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/expensetype/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/expensetype/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
