import { request, config, crypt } from '../../utils'

const { customertype, sellprice } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: customertype,
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function querySellprice (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: sellprice,
    alt: true,
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
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params ? `${customertype}/${params.typeCode}` : customertype
  return request({
    url,
    alt: true,
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
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}
