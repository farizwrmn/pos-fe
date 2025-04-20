import { request, crypt } from '../../utils'

export async function queryAllocation (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/bundling-allocation',
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryMember (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/bundling-member',
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
