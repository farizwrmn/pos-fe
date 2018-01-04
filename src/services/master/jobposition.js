import { request, config, crypt } from 'utils'
const { jobposition } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: jobposition,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}


export async function queryField (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: jobposition,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function queryMechanics (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: jobposition + '/mechanics/' + params,
    method: 'get',
    headers: apiHeaderToken,
  })
}

export async function add (params) {
  const url = params.id ? jobposition + '/' + params.id  : jobposition
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'post',
    data: params.data,
    headers: apiHeaderToken,
  })
}

export async function edit (params) {
  const url = params.id ? jobposition + '/' + params.id  : jobposition
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken,
  })
}

export async function remove (params) {
  const url = params.id ? jobposition + '/:id' : jobposition
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken,
  })
}