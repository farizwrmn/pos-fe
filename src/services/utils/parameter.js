import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/utils/parameter',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryId (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/utils/parameter/${params.paramCode}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
