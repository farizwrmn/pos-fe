import { request, config, crypt } from '../../utils'

const { balance } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: balance,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryById (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${balance}/${id}`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = balance
  return request({
    url,
    method: 'post',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${balance}/${params.id}`
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${balance}/${params.id}`
  return request({
    url,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}
