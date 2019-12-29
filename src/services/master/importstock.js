import { request, config, crypt } from 'utils'

const { importstock } = config.api

export async function queryCode (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${importstock}/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${importstock}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: importstock,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
