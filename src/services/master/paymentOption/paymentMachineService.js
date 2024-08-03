import { request, config, crypt } from 'utils'

const { paymentMachine } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: paymentMachine,
    alt: true,
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
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: paymentMachine,
    method: 'post',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentMachine}/${id}`,
    alt: true,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentMachine}/${params.id}`,
    method: 'put',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}
