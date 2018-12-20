import { request, config, crypt } from '../../utils'

const { marketing } = config.api

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${marketing}/target/${params.id}`,
    method: 'get',
    data: {
      relationship: 1
    },
    headers: apiHeaderToken
  })
}

export async function query (params) {
  params.order = '-year,storeId'
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${marketing}/target`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${marketing}/target`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${marketing}/target/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${marketing}/target/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
