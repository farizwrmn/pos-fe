import { request, config, crypt } from '../../utils'

const { customergroup } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: customergroup,
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params ? `${customergroup}/${params.groupCode}` : customergroup
  return request({
    url,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params ? `${customergroup}/${params.groupCode}` : customergroup
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params ? `${customergroup}/${params.groupCode}` : customergroup
  console.log(url, 'url')
  return request({
    url,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
