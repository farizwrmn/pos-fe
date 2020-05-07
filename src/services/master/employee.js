import { request, config, crypt } from '../../utils'

const { employees } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: employees,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryDefault (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${employees}/default/value`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${employees}/${params.id}` : employees
  return request({
    url,
    method: 'post',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${employees}/:id` : employees
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${employees}/${params.id}` : employees
  return request({
    url,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function queryByCode (params) {
  const url = params ? `${employees}/${encodeURIComponent(params)}` : `${encodeURIComponent(employees)}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryField (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: employees,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryMechanics () {
  const url = `${employees}/mechanics/`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'get',
    headers: apiHeaderToken
  })
}

export const getReportCheckin = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/checkin/employee',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryMechanicByCode (params) {
  const url = params.employeeId ? `${employees}/mechanics/${encodeURIComponent(params.employeeId)}` : `${employees}/mechanics/${encodeURIComponent(params)}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'get',
    headers: apiHeaderToken
  })
}
