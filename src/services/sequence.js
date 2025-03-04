import { request, config, crypt } from 'utils'

const { sequence } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: sequence,
    alt: true,
    method: 'get',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}
