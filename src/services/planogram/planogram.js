import { request, config, crypt } from '../../utils'

const { planogram } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: planogram,
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: planogram,
    alt: true,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${planogram}/${id}`,
    alt: true,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${planogram}/${params.id}`,
    method: 'put',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}
