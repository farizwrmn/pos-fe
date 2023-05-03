import { request, config, crypt } from 'utils'

const { paymentMachine } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: paymentMachine,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryLov (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentMachine}-all`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: paymentMachine,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentMachine}/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentMachine}/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
