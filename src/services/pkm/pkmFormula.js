import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/pkm-formula',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/product-active/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function addImport (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/product-active-import',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
