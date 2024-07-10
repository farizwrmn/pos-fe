import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/auto-replenish-buffer',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/auto-replenish-buffer/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
