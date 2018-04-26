import { request, config, crypt } from 'utils'

const { apiMobile } = config.rest

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiMobile}/members/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryActive (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiMobile}/members/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
