import { request, config, crypt } from 'utils'

const { transfer } = config.api

export async function queryOut (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: params ? `${transfer}/out` : transfer,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}