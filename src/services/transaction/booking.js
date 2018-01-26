import { request, config, crypt } from 'utils'

const { mobileBooking } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: mobileBooking,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function queryHistory (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: params ? `${mobileBooking}/${params}/history` : mobileBooking,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function update (params) {
  const apiHeaderToken = crypt.apiheader()
  console.log(params)
  return request({
    url: params.id ? `${mobileBooking}/${params.id}` : mobileBooking,
    method: 'put',
    data: params.status,
    body: params.status,
    headers: apiHeaderToken,
  })
}

export async function add (params) {
  let url = `${transfer}/in`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken,
  })
}
