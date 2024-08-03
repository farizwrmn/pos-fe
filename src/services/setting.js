import { request, config, crypt } from '../utils'

const { setting } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: setting,
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const url = `${setting}/${params.id}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}
