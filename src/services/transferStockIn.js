import { request, config, crypt } from 'utils'

const { transfer } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${transfer}/in`,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function add (params) {
  let url = `${transfer}/in`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken,
  })
}