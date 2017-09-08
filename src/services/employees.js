import { request, config, crypt } from 'utils'
const { employees } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: employees,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function queryByCode (params) {
  const url = params ? `${employees}/${params}` : `${employees}`
  console.log(url)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function queryField (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: employees,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function queryMechanics (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: employees + '/mechanics/',
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryMechanicByCode (params) {
  const url = params.employeeId ? employees + '/mechanics/' + params.employeeId : employees + '/mechanics/' + params
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const url = params.id ? employees + '/' + params.id  : employees
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'post',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const url = params.id ? employees + '/' + params.id  : employees
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'put',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const url = params.id ? employees + '/:id' : employees
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}
