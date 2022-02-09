import { request, config, crypt } from '../../utils'

const { subaPromo } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: subaPromo,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: subaPromo,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${subaPromo}/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${subaPromo}/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
