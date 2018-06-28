import { request, config, crypt } from '../../utils'

const { suppliers } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${suppliers}/bank`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function querySupplier (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${suppliers}/bank/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${suppliers}/bank`
  return request({
    url,
    method: 'post',
    data: params.data,
    headers: apiHeaderToken
  })
}
