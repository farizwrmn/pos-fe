import { request, config, crypt } from '../../utils'

const { apiSpecification } = config.rest

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiSpecification}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiSpecification}/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiSpecification}`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiSpecification}/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiSpecification}/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
