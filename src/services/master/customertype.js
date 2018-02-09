import { request, config, crypt } from '../../utils'

const { customertype, sellprice } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: customertype,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function querySellprice (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: sellprice,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params ? `${customertype}/${params.typeCode}` : customertype
  return request({
    url,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params ? `${customertype}/${params.typeCode}` : customertype
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params ? `${customertype}/${params.typeCode}` : customertype
  console.log(url, 'url')
  return request({
    url,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
