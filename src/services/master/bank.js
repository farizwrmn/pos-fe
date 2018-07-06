import { request, config, crypt } from '../../utils'

const { bank } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: bank,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${bank}/delete/${id}`,
    method: 'put',
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: bank,
    method: 'post',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${bank}/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
