import { request, crypt } from 'utils'


export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/adjust-new/${params.id}`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/adjust-new',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
