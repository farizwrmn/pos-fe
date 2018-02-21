import { request, config, crypt } from '../utils'

const { stores } = config.api

export async function query () {
  const url = stores
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'get',
    // data: params,
    headers: apiHeaderToken
  })
}

export async function query1store (params) {
  const url = `${stores}/${params.code}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'get',
    // data: params,
    headers: apiHeaderToken
  })
}
