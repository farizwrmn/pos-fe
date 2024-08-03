import { request, config, crypt } from 'utils'

const { misc } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    alt: true,
    url: misc,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryMode (params) {
  const { code, ...fields } = params
  let url = `${misc}/code/${code}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    alt: true,
    method: 'get',
    data: fields,
    headers: apiHeaderToken
  })
}

export async function queryModeName (params) {
  const { code, name, ...fields } = params
  let url = `${misc}/code/${encodeURIComponent(code)}/name/${encodeURIComponent(name)}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    alt: true,
    url,
    method: 'get',
    data: fields,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  let url = params.id ? `${misc}/code/${encodeURIComponent(params.id)}` : misc
  url = params.name ? `${url}/name/${encodeURIComponent(params.name)}` : url
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    alt: true,
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  let url = params.id ? `${misc}/code/${encodeURIComponent(params.id)}` : misc
  url = params.name ? `${url}/name/${encodeURIComponent(params.name)}` : url
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    alt: true,
    method: 'put',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  let url = params.id ? `${misc}/code/${encodeURIComponent(params.id)}` : misc
  url = params.name ? `${url}/name/${encodeURIComponent(params.name)}` : url
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    alt: true,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}
