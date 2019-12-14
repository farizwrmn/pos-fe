import { request, config, crypt } from '../../utils'

const { bookmark } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: bookmark,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: bookmark,
    method: 'post',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${bookmark}/${params.id}`
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${bookmark}/${params.id}`
  return request({
    url,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}
