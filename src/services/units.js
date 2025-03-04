import { request, config, crypt } from 'utils'

const { customers, services } = config.api

export async function query (params) {
  const url = params ? `${customers}/${encodeURIComponent(params.id)}/units` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'get',
    alt: true,
    // data: params,
    headers: apiHeaderToken
  })
}

export async function queryOneUnit (params) {
  const url = params ? `${customers}/${encodeURIComponent(params.id)}/units/${encodeURIComponent(params.policeNo)}` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'get',
    // data: params,
    headers: apiHeaderToken
  })
}

export async function queryField (member, params) {
  const url = params ? `${customers}/${encodeURIComponent(member.code)}/units` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const url = params.id ? `${customers}/${encodeURIComponent(params.data.memberCode)}/units/${encodeURIComponent(params.id)}` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const url = params.id ? `${customers}/${encodeURIComponent(params.data.memberCode)}/units/${encodeURIComponent(params.id)}` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const url = params.id ? `${customers}/${encodeURIComponent(params.id.data)}/units/${encodeURIComponent(params.id.id)}` : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'delete',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function getServiceReminder () {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${services}/checks`,
    alt: true,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function getServiceUsageReminder (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${services}/checks/usage`,
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
