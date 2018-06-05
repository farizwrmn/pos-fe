import { request, config, crypt } from 'utils'

const { apiTools } = config.rest

export async function queryHeader (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiTools}/sellprice/header`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiTools}/sellprice`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiTools}/sellprice`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function update (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiTools}/sellprice/update`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function cancel (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiTools}/sellprice/cancel/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
