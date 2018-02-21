import { request, config, crypt } from 'utils'

const { transfer } = config.api

export async function queryOut (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: params ? `${transfer}/out` : transfer,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: params ? `${transfer}/out` : transfer,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

